import createClient from "@/supabase/clients/server";
import { Activity } from "@/app/_types/activity";
import { Poll } from "@/app/_types/poll";
import { Quiz } from "@/app/_types/quiz";
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
    const client = createClient();
    return await client
        .from("room_events")
        .select("*")
        .eq("id", parseInt(startEventId))
        .single()
        .overrideTypes<{payload: StartEventPayload}>();
}


async function getEndEvent(endEventId: string) {
    const client = createClient();
    return await client
        .from("room_events")
        .select("*")
        .eq("id", parseInt(endEventId))
        .single()
        .overrideTypes<{payload: EndEventPayload}>();
}

/** Find the end event corresponding to the start event */
async function findEndEvent(type: "poll" | "quiz", startEventId: string) {
    const client = createClient();
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
    const client = createClient();
    return await client
        .from("activities")
        .select("*")
        .eq("id", parseInt(id))
        .single()
        .overrideTypes<{object: T}>();
}

async function getAttendances(roomId: string) {
    const client = createClient();
    return await client
        .from("attendance")
        .select("*")
        .eq("room_id", parseInt(roomId))
}

async function getCapsuleMetadata(capsuleId: string) {
    const client = createClient();
    return await client
        .from("capsules")
        .select("id, title")
        .eq("id", capsuleId)
        .single()
}

async function getCapsuleId(roomId: string) {
    const client = createClient();
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

async function getQuizData(startEventId: string) {
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



type GetPollDataResponse = NonNullable<Awaited<ReturnType<typeof getPollData>>["data"]>;
type GetQuizDataResponse = NonNullable<Awaited<ReturnType<typeof getQuizData>>["data"]>;


export function makeDataArrayForPoll(
    data: GetPollDataResponse
): string[][] {
    const { capsule, activity, start, end, attendances } = data;

    const arr: string[][] = [
        ["Capsule", capsule.title || "Sans titre"],
        ["Sondage", activity.object.title],
        ["Date de début", new Date(start.timestamp).toLocaleString()],
        ["Date de fin", new Date(end.timestamp).toLocaleString()],
        [""],
        ["Nombre de questions", activity.object.questions.length.toString()],
        ["Nombre de participants", attendances.length.toString()],
    ];

    return arr;
}