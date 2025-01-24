import 'server-only'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { adapter } from './utils'
import { getUser } from '../auth/auth.server'
import { Quiz } from '@/app/_types/quiz'
import { Poll } from '@/app/_types/poll'
import { Tables } from '@/supabase/types/database.types'
import { ActivityTypeTable, ActivityTypeWidget } from '@/app/_types/activity'



export const fetchActivity = async (id: number) => {
    const supabase = createClient()
    logger.log('supabase:database', `Fetching activity ${id}...`)
    const { data, error } = await supabase.from('activities').select().eq('id', id).single()

    if (error || !data) {
        logger.error('supabase:database', `Error fetching activity ${id}`, error?.message)
        return { data, error: error?.message }
    }

    const type = data.type

    switch (type) {
        case 'quiz':
            const quiz = adapter.toQuiz(data.object)
            if (!quiz) {
                logger.error('supabase:database', 'Error parsing quiz')
                return { data: null, error: 'Error parsing quiz' }
            }
            return { data: { ...data, object: quiz }, error: null }

        case 'poll':
            const poll = adapter.toPoll(data.object)
            if (!poll) {
                logger.error('supabase:database', 'Error parsing poll')
                return { data: null, error: 'Error parsing poll' }
            }
            return { data: { ...data, object: poll }, error: null }

        default:
            logger.error('supabase:database', 'Unknown activity type')
            return { data: null, error: 'Unknown activity type' }
    }
}

// TO REMOVE WHEN THE API IS READY
export const TMPfetchActivitiesWidgetData = async (data: ActivityTypeTable[]) => {
    logger.log('supabase:database', 'fetchActivitiesWidgetData', `Fetching activities widget data for ${data.length} activities ...`)

    const getSuccessRate = (questions: any) => {
        let correct = 0;
        questions.map((question: any) => {
            if (question.correct_answer === question.answer)
                correct++;
        });
        // return ((correct / questions.length) * 100);
        return (Math.floor(Math.random() * (100 - 0)));
    };
    const getParticipationRate = (questions: any) => {
        let answered = 0;
        questions.map((question: any) => {
            if (question.answer)
                answered++;
        });
        // return ((answered / questions.length) * 100);
        return (Math.floor(Math.random() * (100 - 0)));
    };

    const activities = Array.from(data.map((item) => {
        let title = "";
        let percentage = 0;
        let nbQuestions = 0;
        if (item.object)
        {
            Object.entries(item.object).map(([key, value]) => {
                
                if (key === 'title')
                    title = value;
                if (key === 'questions')
                {
                    if (item.type === 'quiz')
                        // Calculate the percentage of questions answered correctly for quizzes
                        percentage = getSuccessRate(value);
                    else if (item.type === 'poll')
                        // Calculate the percentage of answered questions
                       percentage = getParticipationRate(value);
                    nbQuestions = value.length;
                }
            });
        }

        const activity: ActivityTypeWidget = {
            id: item.id,
            type: item.type,
            title: title,
            launched_at: new Date().toString(),
            stopped_at: new Date().toString(),
            percentage: percentage,
            nbQuestions: nbQuestions
        }
        return (activity);
    }));
    await new Promise(resolve => setTimeout(resolve, 1000))  ;
    return ({ data: activities, error: null });
};
// A revoir ou supprimer
export const fetchActivitiesWidgetData = async (roomId: number) => {
    const supabase = createClient()
    logger.log('supabase:database', 'fetchActivitiesWidgetData', `Fetching activities widget data for room ${roomId}...`)
    const { data, error } = await supabase.from('activities').select("*").eq('room_id', roomId).order('launched_at', { ascending: false });

    if (error || !data) {
        logger.error('supabase:database', 'fetchActivitiesWidgetData', `Error fetching activities widget data for room ${roomId}`, error?.message)
        return { data: [], error: error?.message }
    }

    const activities = Array.from(data.map((item) => {
        let title = "";
        let percentage = 0;
        let nbQuestions = 0;
        if (item.object)
        {   
            Object.entries(item.object).map(([key, value]) => {
                
                if (key === 'title')
                    title = value;
                if (key === 'questions')
                {
                    if (item.type === 'quiz')
                        // Calculate the percentage of questions answered correctly for quizzes
                        console.log("QUIZ")
                    else if (item.type === 'poll')
                        // Calculate the percentage of answered questions
                        console.log("POLL")
                    nbQuestions = value.length;
                }
            });
        }

        // const activity: ActivityTypeWidget = {
        //     id: item.id,
        //     type: item.type,
        //     title: title,
        //     launched_at: item.launched_at,
        //     percentage: percentage,
        //     nbQuestions: nbQuestions
        // }
        // return (activity);
    })); 

    return { data: activities, error: null }
};


// Supabase returns `Json` instead of `Quiz` or `Poll` objects
// Let's declare the type of data we want to return
interface ReturnedData extends Omit<Tables<'activities'>, 'object'> {
    object: Quiz | Poll
}


export const fetchActivitiesOfCurrentUser = async (limit?: number): Promise<{ data: ReturnedData[], error: string | null }> => {
    const { data: { user: user }, error: userError } = await getUser()
    const userId = user?.id

    if (!userId || userError) {
        logger.error('supabase:database', 'Error fetching user', userError?.message)
        return { data: [], error: userError?.message || null }
    }

    const supabase = createClient()
    logger.log('supabase:database', `Fetching activities of user ${userId}...`)
    const { data, error } = await supabase.from('activities').select().eq('created_by', userId).limit(limit || 100).order('created_at', { ascending: false })

    if (error || !data) {
        logger.error('supabase:database', `Error fetching activities of user ${userId}`, error?.message)
        return { data: [], error: error?.message || null }
    }

    // Let's use the adapter to parse the JSON data
    // If the adapter returns undefined, we'll remove the activity from the list
    let activities = data.map((activity) => {
        const type = activity.type

        switch (type) {
            case 'quiz':
                return { ...activity, object: adapter.toQuiz(activity.object) }
            case 'poll':
                return { ...activity, object: adapter.toPoll(activity.object) }
            default:
                return { ...activity, object: undefined }
        }
    }).filter((activity) => activity !== null && activity.object !== undefined) as ReturnedData[]

    return { data: activities, error: null }
}



export async function fetchSnapshot(roomId: number) {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('activity_snapshot').eq('id', roomId).single()

    if (error) {
        logger.error('supabase:database', `Error fetching snapshot of room ${roomId}`, error.message)
        return { data: null, error: error.message }
    }

    return { data, error: null }
}



