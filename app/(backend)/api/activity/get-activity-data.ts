import createClient from "@/supabase/clients/server";
import { Activity } from "@/core/domain/entities/activity";
import { Poll } from "@/core/domain/entities/poll";
import { Quiz } from "@/core/domain/entities/quiz";
import Result from "@/app/_utils/ServerResponse";


type StartEventPayload = {
    activityId: string;
};

type EndEventPayload = {
    startEventId: string;
    answers: {
        choiceId: string;
        questionId: string;
        timestamp: number;
        userId: string;
    }[];
};

async function getStartEvent(startEventId: string) {
    const client = await createClient();
    return await client
        .from("room_events")
        .select("*")
        .eq("id", parseInt(startEventId))
        .single()
        .overrideTypes<{payload: StartEventPayload}>();
}


async function getEndEvent(endEventId: string) {
    const client = await createClient();
    return await client
        .from("room_events")
        .select("*")
        .eq("id", parseInt(endEventId))
        .single()
        .overrideTypes<{payload: EndEventPayload}>();
}

/** Find the end event corresponding to the start event */
async function findEndEvent(type: "poll" | "quiz", startEventId: string) {
    const client = await createClient();
    return await client
        .from("room_events")
        .select("*")
        .eq("payload ->> startEventId", startEventId)
        .eq("type", "end " + type)
        .order("timestamp", { ascending: false })
        .single()
        .overrideTypes<{payload: EndEventPayload}>();
}

async function getActivity<T extends Activity>(id: string) {
    const client = await createClient();
    return await client
        .from("activities")
        .select("*")
        .eq("id", parseInt(id))
        .single()
        .overrideTypes<{object: T}>();
}

async function getAttendances(roomId: string) {
    const client = await createClient();
    return await client
        .from("attendance")
        .select("*")
        .eq("room_id", parseInt(roomId))
}

async function getCapsuleMetadata(capsuleId: string) {
    const client = await createClient();
    return await client
        .from("capsules")
        .select("id, title")
        .eq("id", capsuleId)
        .single()
}

async function getCapsuleId(roomId: string) {
    const client = await createClient();
    return await client
        .from("rooms")
        .select("capsule_id")
        .eq("id", parseInt(roomId))
        .single()
}

export async function getPollData(startEventId: string) {
    const startEvent = await getStartEvent(startEventId);
    if (startEvent.error) {
        return { data: null, error: startEvent.error };
    }
    const startEventData = startEvent.data;

    const endEvent = await findEndEvent("poll", startEventId);
    if (endEvent.error) {
        return { data: null, error: endEvent.error };
    }
    const endEventData = endEvent.data;

    const activity = await getActivity<Poll>(startEventData.payload.activityId);
    if (activity.error) {
        return { data: null, error: activity.error };
    }
    const activityData = activity.data;

    const attendances = await getAttendances(startEventData.room_id.toString());
    if (attendances.error) {
        return { data: null, error: attendances.error };
    }

    const capsuleId = await getCapsuleId(startEventData.room_id.toString());
    if (capsuleId.error) {
        return { data: null, error: capsuleId.error };
    }
    if (!capsuleId.data.capsule_id) {
        return { data: null, error: new Error("Capsule ID not found") };
    }

    const capsuleMetadata = await getCapsuleMetadata(capsuleId.data.capsule_id);
    if (capsuleMetadata.error) {
        return { data: null, error: capsuleMetadata.error };
    }

    return {
        data: {
            capsule: capsuleMetadata.data,
            activity: activityData,
            start: startEventData,
            end: endEventData,
            attendances: attendances.data,
        },
        error: null,
    };
}

export async function getQuizData(startEventId: string) {
    const startEvent = await getStartEvent(startEventId);
    if (startEvent.error) {
        return { data: null, error: startEvent.error };
    }
    const startEventData = startEvent.data;

    const endEvent = await findEndEvent("quiz", startEventId);
    if (endEvent.error) {
        return { data: null, error: endEvent.error };
    }
    const endEventData = endEvent.data;

    const activity = await getActivity<Quiz>(startEventData.payload.activityId);
    if (activity.error) {
        return { data: null, error: activity.error };
    }
    const activityData = activity.data;

    const attendances = await getAttendances(startEventData.room_id.toString());
    if (attendances.error) {
        return { data: null, error: attendances.error };
    }

    const capsuleId = await getCapsuleId(startEventData.room_id.toString());
    if (capsuleId.error) {
        return { data: null, error: capsuleId.error };
    }
    if(!capsuleId.data.capsule_id) {
        return { data: null, error: new Error("Capsule ID not found") };
    }

    const capsuleMetadata = await getCapsuleMetadata(capsuleId.data.capsule_id);
    if (capsuleMetadata.error) {
        return { data: null, error: capsuleMetadata.error };
    }

    return {
        data: {
            capsule: capsuleMetadata.data,
            activity: activityData,
            start: startEventData,
            end: endEventData,
            attendances: attendances.data,
        },
        error: null,
    };
}


function makePollQuestionsArray(args: {
    index: number;
    questionText: string;
    choices: {
        text: string;
        timesAnswered: number;
    }[];
}) {
    const header = ["Question " + (args.index + 1), args.questionText, "Nombre de réponses"];
    const data = args.choices.map((choice, i) => [
        "Réponse " + String.fromCharCode(65 + i), // Convert index to corresponding letter (A, B, C, ...)
        choice.text,
        choice.timesAnswered.toString(),
    ]);

    return [header, ...data];
}

function makeQuizQuestionsArray(args: {
    index: number;
    questionText: string;
    choices: {
        text: string;
        timesAnswered: number;
        isCorrect: boolean;
    }[];
}) {
    const header = ["Question " + (args.index + 1), args.questionText, "Réponse correcte", "Nombre de réponses"];
    const data = args.choices.map((choice, i) => [
        "Réponse " + String.fromCharCode(65 + i), // Convert index to corresponding letter (A, B, C, ...)
        choice.text,
        choice.isCorrect ? "VRAI" : "FAUX",
        choice.timesAnswered.toString(),
    ]);

    return [header, ...data];
}

function makeQuizAnswersDetailsArray(args: {
    questionText: string;
    answers: {
        userFullName: string;
        choiceText: string;
        isCorrect: boolean;
    }[];
}) {

    const header1 = ["Question", args.questionText];
    const header2 = ["Nom", "Réponse", "Résultat"];

    const data = args.answers.map((answer) => [
        answer.userFullName,
        answer.choiceText,
        answer.isCorrect ? "Correct" : "Incorrect",
    ]);
    return [header1, header2, ...data];
}

type GetPollDataResponse = NonNullable<Awaited<ReturnType<typeof getPollData>>["data"]>;
type GetQuizDataResponse = NonNullable<Awaited<ReturnType<typeof getQuizData>>["data"]>;


export function makeDataArrayForPoll(
    data: GetPollDataResponse
): string[][] {
    const { capsule, activity, start, end, attendances } = data;

    // Main info
    const arr: string[][] = [
        ["Capsule", capsule.title || "Sans titre"],
        ["Sondage", activity.object.title],
        ["Date de début", new Date(start.timestamp).toLocaleString()],
        ["Date de fin", new Date(end.timestamp).toLocaleString()],
        [" "],
        ["Nombre de questions", activity.object.questions.length.toString()],
        ["Nombre de participants", attendances.length.toString()],
        [" "]
    ];

    // Questions
    for (let i = 0; i < activity.object.questions.length; i++) {
        const question = activity.object.questions[i];
        const choices = question.choices.map((choice) => ({
            text: choice.text,
            timesAnswered: end.payload.answers.filter(
                (answer) => answer.choiceId === choice.id
            ).length,
        }));

        arr.push(...makePollQuestionsArray({ index: i, questionText: question.text, choices }));
        arr.push([" "]);
    }

    return arr;
}

export function makeDataArrayForQuiz(
    data: GetQuizDataResponse
): string[][] {
    const { capsule, activity, start, end, attendances } = data;

    // Main info
    const arr: string[][] = [
        ["Capsule", capsule.title || "Sans titre"],
        ["Quiz", activity.object.title],
        ["Date de début", new Date(start.timestamp).toLocaleString()],
        ["Date de fin", new Date(end.timestamp).toLocaleString()],
        [" "],
        ["Nombre de questions", activity.object.questions.length.toString()],
        ["Nombre de participants", attendances.length.toString()],
        [" "]
    ];

    // Questions
    for (let i = 0; i < activity.object.questions.length; i++) {
        const question = activity.object.questions[i];
        const choices = question.choices.map((choice) => ({
            text: choice.text,
            timesAnswered: end.payload.answers.filter(
                (answer) => answer.choiceId === choice.id
            ).length,
            isCorrect: choice.isCorrect,
        }));

        arr.push(...makeQuizQuestionsArray({ index: i, questionText: question.text, choices }));
        arr.push([" "]);
    }

    // Answers details
    for (let i = 0; i < activity.object.questions.length; i++) {
        const question = activity.object.questions[i];
        const answers = end.payload.answers
            .filter((answer) => answer.questionId === question.id)
            .map((answer) => {
                const user = attendances.find((user) => user.user_id === answer.userId);
                return {
                    userFullName: user ? user.first_name + " " + user.last_name : "Anonyme",
                    choiceText: question.choices.find((choice) => choice.id === answer.choiceId)?.text || "Texte vide",
                    isCorrect: question.choices.find((choice) => choice.id === answer.choiceId)?.isCorrect || false,
                };
            });
        arr.push(...makeQuizAnswersDetailsArray({ questionText: question.text, answers }));
        arr.push([" "]);
    }

    return arr;
}