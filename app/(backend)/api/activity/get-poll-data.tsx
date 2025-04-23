import createClient from "@/supabase/clients/server";
import { Activity } from "@/app/_types/activity";
import { Poll } from "@/app/_types/poll";


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

async function getPollData(startEventId: string) {
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

    return {
        data: {
            activity: activityData,
            start: startEventData,
            end: endEventData,
            attendances: attendances.data,
        },
        error: null,
    };
}