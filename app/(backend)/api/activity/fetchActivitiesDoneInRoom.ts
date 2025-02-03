"use server";
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'
import DatabaseResponse from '@/app/_utils/DatabaseResponse'
import { Poll, PollUserAnswer } from '@/app/_types/poll'
import { Quiz, QuizUserAnswer } from '@/app/_types/quiz'


export type ActivityData = {
    widgetId: string,
    activityId: string,
    type: 'quiz' | 'poll',
    title: string,
    startDate: Date,

    /**  Undefined if the activity is still ongoing */
    endDate: Date | undefined,

    /**  e.g. 75 for 75% of success. Undefined if the activity is still ongoing */
    relevantNumber: number | undefined
    nbQuestions: number
}

export async function fetchActivitiesDoneInRoom(roomId: string): Promise<DatabaseResponse<
    Array<ActivityData>,
    Error
>> {
    const supabase = createClient()

    // Fetch all the events rows
    const { data: events, error } = await supabase
        .from('room_events')
        .select('*')
        .eq('room_id', roomId)


    if (error) {
        logger.error(
            'supabase:database',
            'activity.server.ts',
            `fetchActivitiesDoneInRoom(${roomId})`,
            'Error fetching events',
            error.message
        )
        return {
            error: new Error('Error fetching events'),
            data: null
        }
    }

    if (events.length === 0) {
        logger.log(
            'supabase:database',
            'activity.server.ts',
            `fetchActivitiesDoneInRoom(${roomId})`,
            'No events found for this room'
        )
        return { error: null, data: [] }
    }


    // Let's make an intermediary object that will be usefull to construct the result array
    // It will be an array of objects gathering together the start and end events of the same activity
    const eventCouples: Array<{ start: typeof events[0], end: typeof events[0] | undefined }> = []

    // Iterate through the start events (as there are as many activities done as there are start events)
    const startEvents = events.filter((event) => event.type === 'start quiz' || event.type === 'start poll')
    for (const startEvent of startEvents) {
        // We'll find the corresponding end event
        const endEvent = events.find((event) => {
            const payload = event.payload as { startEventId: string }
            return payload.startEventId === `${startEvent.id}`
        })

        eventCouples.push({ start: startEvent, end: endEvent })
    }

    // There's something we don't have yet: the titles of the activities
    const activitiesIds = startEvents.map((event) => {
        const payload = event.payload as { activityId: string }
        return payload.activityId
    })


    const { data: titlesTypesQuestions, error: titlesError } = await supabase
        .from('activities')
        .select('id, type, object->>title, object->>questions')
        .in('id', activitiesIds)

    if (titlesError) {
        logger.error(
            'supabase:database',
            'activity.server.ts',
            `fetchActivitiesDoneInRoom(${roomId})`,
            'Error fetching activities titles',
            titlesError.message
        )
        return {
            error: new Error('Error fetching activities titles'),
            data: null
        }
    }


    // Now we can construct the final result array (ignore the relevantNumber for now)
    const activities: Array<ActivityData> = eventCouples.map((couple) => {
        const start = couple.start
        const end = couple.end
        const widgetId = (end?.payload as { startEventId: string }).startEventId;
        const activityId = (start.payload as { activityId: string }).activityId
        const titleTypeQuestion = titlesTypesQuestions.find((titleTypeQuestion) => `${titleTypeQuestion.id}` === activityId) || { type: 'quiz', title: 'Unknown', questions: '' }
        const title = titleTypeQuestion.title
        const type = titleTypeQuestion.type as 'quiz' | 'poll'
        const startDate = new Date(start.timestamp)
        const endDate = end ? new Date(end.timestamp) : undefined
        const questions = JSON.parse(titleTypeQuestion.questions);        
        const nbQuestions = Array.isArray(questions) ? questions.length : 0

        return { widgetId, activityId, type, title, startDate, endDate, relevantNumber: undefined, nbQuestions }
    })

    // Now we need to compute the relevant number for each activity
    for (const event of eventCouples) {
        const answers = event.end ? (event.end.payload as unknown as { answers: QuizUserAnswer[] | PollUserAnswer[] }).answers : []
        if (answers.length === 0) {
            continue
        }

        if (event.start.type === 'start poll') {
            const { data: percentage, error } = await computePollParticipation({
                roomId,
                pollId: (event.start.payload as { activityId: string }).activityId,
                answers: answers as PollUserAnswer[]
            })

            if (error) {
                logger.error(
                    'supabase:database',
                    'activity.server.ts',
                    `fetchActivitiesDoneInRoom(${roomId})`,
                    'Error computing poll participation',
                    error.message
                )
                return {
                    error: new Error('Error computing poll participation'),
                    data: null
                }
            }

            const activityIndex = activities.findIndex((activity) => {
                return (activity.widgetId === (event.end!.payload as { startEventId: string }).startEventId);
            });

            activities[activityIndex].relevantNumber = percentage

        } else if (event.start.type === 'start quiz') {

            const { data: percentage, error } = await computeQuizSuccess({
                quizId: (event.start.payload as { activityId: string }).activityId,
                answers: answers as QuizUserAnswer[]
            })

            if (error) {
                logger.error(
                    'supabase:database',
                    'activity.server.ts',
                    `fetchActivitiesDoneInRoom(${roomId})`,
                    'Error computing quiz success',
                    error.message
                )
                return {
                    error: new Error('Error computing quiz success'),
                    data: null
                }
            }

            const activityIndex = activities.findIndex((activity) => {
                return (activity.widgetId === (event.end!.payload as { startEventId: string }).startEventId);
            });
            activities[activityIndex].relevantNumber = percentage
        }
    }
    const activitiesForWidget = Array.from(activities.map((item) => {
        logger.log('supabase:database', 'fetchActivitiesDoneInRoom', `Activity ${item.activityId} (${item.type}) title: ${item.title}`);
        const activity = {
            widgetId: item.widgetId,
            activityId: item.activityId,
            type: item.type,
            title: item.title,
            startDate: item.startDate || new Date(),
            endDate: item.endDate || new Date(),
            relevantNumber: item.relevantNumber || 0,
            nbQuestions: item.nbQuestions
        } as ActivityData;

        return (activity);
    }).toSorted((a, b) => a.startDate.getTime() - b.startDate.getTime()));
    return { error: null, data: activitiesForWidget }
}



async function computePollParticipation(args: {
    roomId: string,
    pollId: string,
    answers: PollUserAnswer[]
}): 
    Promise<DatabaseResponse<number, Error>>
{
    const supabase = createClient()

    // We need to count how many attendencies for this room
    const { data, error } = await supabase
        .from('attendance')
        .select('user_id')
        .eq('room_id', args.roomId)

    if (error) {
        logger.error(
            'supabase:database',
            'activity.server.ts',
            'computePollParticipation',
            'Error fetching attendencies',
            error.message
        )
        return {
            error: new Error('Error fetching attendencies: ' + error.message),
            data: null
        }
    }
    const { data: activityData, error: activityError } = await supabase
    .from('activities')
    .select('object')
    .eq('id', args.pollId)
    .single();

    if (activityError) {
        logger.error(
            'supabase:database',
            'activity.server.ts',
            'computePollParticipation',
            'Error fetching poll object',
            activityError.message
        );
        return {
            error: new Error('Error fetching poll object: ' + activityError.message),
            data: null
        };
    }
    const userIds = data.map((row) => row.user_id)
    const uniqueUserIds = new Set(userIds)
    const totalParticipants = Array.from(uniqueUserIds).length
    const questions = (activityData.object as unknown as Poll).questions.map((question) => ({
        questionId: question.id,
        totalParticipant: 0
    }));
    // Now we need to count how many users answered the poll
    // We'll find all the userIds in the answers, and count the unique ones
    const answeredUserIds = args.answers.map((answer) => answer.userId)
    const uniqueAnsweredUserIds = new Set(answeredUserIds)
    // const answeredParticipants = Array.from(uniqueUserIds).filter(userId =>
    //     uniqueAnsweredUserIds.has(userId)
    // ).length;
    uniqueAnsweredUserIds.forEach(userId => {
        questions.forEach(question => {
            const userAnswered = args.answers.find(a => a.userId === userId && a.questionId === question.questionId);
            if (userAnswered)
                question.totalParticipant++;
        });
    });
    const participation = questions.map(question => question.totalParticipant).reduce((sum, total) => sum + total, 0) / questions.length;

    const ratio = totalParticipants > 0 ? participation / totalParticipants : 0
    const percentage = Math.round(ratio * 100)

    return { error: null, data: percentage }
}


async function computeQuizSuccess(args: {
    quizId: string,
    answers: QuizUserAnswer[]
}): 
    Promise<DatabaseResponse<number, Error>>
{
    // We need to fetch the activity object to get the correct answers
    const supabase = createClient()
    const { data, error } = await supabase
        .from('activities')
        .select('object')
        .eq('id', args.quizId)
        .single()

    if (error) {
        logger.error(
            'supabase:database',
            'activity.server.ts',
            'computeQuizSuccess',
            'Error fetching quiz object',
            error.message
        )
        return {
            error: new Error('Error fetching quiz object: ' + error.message),
            data: null
        }
    }
    const questions = (data.object as unknown as Quiz).questions.map((question) => ({
        questionId: question.id,
        correctChoices: question.choices.filter(choice => choice.isCorrect).map(choice => choice.id),
        totalChoices: question.choices.length
    }));

    const usersScores: { [userId: string]: number } = {};
    const allUserIds = new Set<string>();

    // Initialize the scores
    args.answers.forEach(answer => {
        allUserIds.add(answer.userId);
        if (!(answer.userId in usersScores))
            usersScores[answer.userId] = 0;
    });

    // Adding points for unanswered questions

    allUserIds.forEach((userId, index) => {
        questions.forEach(question => {
            const userAnswers = args.answers.filter(a => a.userId === userId && a.questionId === question.questionId);
            const correctAnswered = userAnswers.filter(a => question.correctChoices.includes(a.choiceId)).length;
            const wrongAnswered = userAnswers.filter(a => !question.correctChoices.includes(a.choiceId)).length;
            const totalCorrectChoices = question.correctChoices.length;
            const totalWrongChoices = question.totalChoices - totalCorrectChoices;
            const notGivenCorrectAnswers = totalCorrectChoices - correctAnswered; // ❌ -1 for each correct answer not given
            const notGivenWrongAnswers = totalWrongChoices - wrongAnswered; // ✅ +1 for each wrong answer not given
            let questionScore = 0;
            questionScore += correctAnswered; // ✅ +1 for each correct answer given
            questionScore - wrongAnswered >= 0 ? wrongAnswered : 0; // ❌ -1 for each wrong answer given
            questionScore - notGivenCorrectAnswers >= 0 ? notGivenCorrectAnswers : 0; // ❌ -1 for each correct answer not given
            questionScore += notGivenWrongAnswers; // ✅ +1 for each wrong answer not given
            usersScores[userId] += questionScore;
        });
    });

    // Calculate the final score
    const totalUsers = allUserIds.size;
    const totalPossibleScore = questions.reduce((sum, q) => sum + q.totalChoices, 0) * totalUsers;
    const totalRealScore = Object.values(usersScores).reduce((sum, score) => sum + score, 0);
    let finalScorePercentage = totalUsers > 0 && totalPossibleScore > 0
        ? (totalRealScore / totalPossibleScore) * 100
        : 0;
    finalScorePercentage = Math.max(0, Math.min(100, finalScorePercentage));
    return { error: null, data: Math.round(finalScorePercentage) };
}