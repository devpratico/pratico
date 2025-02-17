import "server-only"
import createClient from "@/supabase/clients/server";
import ServerResponse from "@/app/_utils/ServerResponse";
import logger from "@/app/_utils/logger";


async function getTeacherName(userId: string) {
    const supabase = createClient();
    return await supabase
        .from("user_profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();
}


async function getUserId(startEventId: string): Promise<ServerResponse<string, Error>> {
    const supabase = createClient();
    const {
        data: startEventData,
        error: startEventError
    } = await supabase
        .from("room_events")
        .select("room_id")
        .eq("id", startEventId)
        .single();

    if (startEventError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getUserId",
            "Error fetching start event data",
            startEventError
        );
        return { data: null, error: new Error("Error fetching start event data: " + startEventError.message) };
    }

    const roomId = startEventData.room_id;

    const {
        data: roomData,
        error: roomError
    } = await supabase
        .from("rooms")
        .select("created_by")
        .eq("id", roomId)
        .single();

    if (roomError || !roomData.created_by) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getUserId",
            "Error fetching room data",
            roomError || new Error("No user id found in room data")
        );
        return { data: null, error: new Error("Error fetching room data: " + roomError?.message || "No user id found in room data") };
    }

    return {
        data: roomData.created_by,
        error: null,
    }
}


async function getPollTitle(activityId: string) {
    const supabase = createClient();
    return await supabase
        .from("activities")
        .select("title")
        .eq("id", activityId)
        .single();
}


async function getActivityId(startEventId: string): Promise<ServerResponse<string, Error>> {
    const supabase = createClient();
    const {
        data: startEventData,
        error: startEventError
    } = await supabase
        .from("room_events")
        .select("payload")
        .eq("id", startEventId)
        .single();

    if (startEventError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getActivityId",
            "Error fetching start event data",
            startEventError
        );
        return { data: null, error: new Error("Error fetching start event data: " + startEventError.message) };
    }

    const startEventPayload = startEventData.payload as {
        activityId: string
    }

    return {
        data: startEventPayload.activityId,
        error: null,
    }
}

async function getCapsuleId(startEventId: string): Promise<ServerResponse<string, Error>> {
    const supabase = createClient();
    const {
        data: startEventData,
        error: startEventError
    } = await supabase
        .from("room_events")
        .select("room_id")
        .eq("id", startEventId)
        .single();

    if (startEventError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getCapsuleId",
            "Error fetching start event data",
            startEventError
        );
        return { data: null, error: new Error("Error fetching start event data: " + startEventError.message) };
    }

    return {
        //data: startEventData.capsule_id,
        data: "capsule_id",
        error: null,
    }
}


async function getCapsuleTitle(capsuleId: string) {
    const supabase = createClient();
    return await supabase
        .from("capsules")
        .select("title")
        .eq("id", capsuleId)
        .single();
}


async function getPollDates(args:{
    startEventId: string,
}): Promise<ServerResponse<{
    startDate: Date,
    endDate: Date,
},  Error
>> {
    const supabase = createClient();
    const {
        data: startEventData,
        error: startEventError
     } = await supabase
        .from("room_events")
        .select()
        .eq("id", args.startEventId)
        .single();

    if (startEventError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getPollDates",
            "Error fetching start event data",
            startEventError
        );
        return { data: null, error: new Error("Error fetching start event data: " + startEventError.message) };
    }

    // Find the corresponding end event.
    // It is the next event of type end poll in the same room.
    const {
        data: endEventData,
        error: endEventError
     } = await supabase
        .from("room_events")
        .select()
        .eq("room_id", startEventData.room_id)
        .eq("type", "end poll")
        .order("timestamp", { ascending: true })
        .limit(1)
        .single();

    if (endEventError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getPollDates",
            "Error fetching end event data",
            endEventError
        )
        return { data: null, error: new Error("Error fetching end event data: " + endEventError.message) };
    }

    return {
        data: {
            startDate: new Date(startEventData.timestamp),
            endDate: new Date(endEventData.timestamp)
        },
        error: null,
    };
}


async function getNumbersOfParticipants(args: {
    startEventId: string,
}): Promise<ServerResponse<{
    number: number,
}, Error
>> {
    const supabase = createClient();

    // Find corresponding end event (containing poll results)
    const {
        data: endEventData,
        error: endEventError
    } = await supabase
        .from("room_events")
        .select()
        .eq("id", args.startEventId)
        .eq("type", "end_poll")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

    if (endEventError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getPollParticipation",
            "Error fetching end event data",
            endEventError
        );
        return { data: null, error: new Error("Error fetching end event data: " + endEventError.message) };
    }

    // Parse user answers
    const endEventPayload = endEventData.payload as {
        answers: { userId: string }[]
    }
    const usersIds = endEventPayload.answers.map(answer => answer.userId);
    const uniqueUsersIds = Array.from(new Set(usersIds));
    const participation = uniqueUsersIds.length;

    return {
        data: {
            number: participation,
        },
        error: null,
    }
}


// TODO: Make a common function also used in the reports page
async function getPollParticipationRate(args: {
    startEventId: string,
}): Promise<ServerResponse<{
    participationRate: number
}, Error
>> {
    const supabase = createClient();

    const {
        data: nbPartData,
        error: nbPartError
    } = await getNumbersOfParticipants({ startEventId: args.startEventId });

    if (nbPartError) {
        return { data: null, error: nbPartError };
    }

    // Get room id from start event
    const {
        data: startEventData,
        error: startEventError
     } = await supabase
        .from("room_events")
        .select("room_id")
        .eq("id", args.startEventId)
        .single();

    if (startEventError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getPollParticipation",
            "Error fetching start event data",
            startEventError
        );
        return { data: null, error: new Error("Error fetching start event data: " + startEventError.message) };
    }

    // Count number of attendances for this room, to calculate participation rate
    const {
        data: attendancesData,
        error: attendancesError
     } = await supabase
        .from("attendance")
        .select("user_id")
        .eq("room_id", startEventData.room_id);

    if (attendancesError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getPollParticipation",
            "Error fetching attendances data",
            attendancesError
        );
        return { data: null, error: new Error("Error fetching attendances data: " + attendancesError.message) };
    }

    const attendances = attendancesData.length;

    const participationRate = nbPartData.number / attendances;

    return {
        data: { participationRate },
        error: null,
    };
}


async function getNbOfQuestions(args: {
    startEventId: string,
}): Promise<ServerResponse<{
    number: number,
}, Error
>> {
    const supabase = createClient();

    // Get activity id from start event
    const {
        data: startEventData,
        error: startEventError
     } = await supabase
        .from("room_events")
        .select("payload")
        .eq("id", args.startEventId)
        .single();

    if (startEventError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getNbOfQuestions",
            "Error fetching start event data",
            startEventError
        );
        return { data: null, error: new Error("Error fetching start event data: " + startEventError.message) };
    }

    const startEventPayload = startEventData.payload as {
        activityId: string
    }

    // Fetch Activity
    const {
        data: activityData,
        error: activityError
    } = await supabase
        .from("activities")
        .select("object")
        .eq("id", startEventPayload.activityId)
        .single();

    if (activityError) {
        logger.error(
            "supabase:database",
            "downloadPollCsvReport.ts",
            "getNbOfQuestions",
            "Error fetching activity data",
            activityError
        );
        return { data: null, error: new Error("Error fetching activity data: " + activityError.message) };
    }

    // Count the number of questions
    const activity = activityData.object as {
        questions: { id: string }[]
    }
    const nbOfQuestions = activity.questions.length;

    return {
        data: { number: nbOfQuestions},
        error: null,
    }
}

export async function makeObjectForCsv(args: {
    startEventId: string,
}): Promise<ServerResponse<{
    csvData: Record<string, any>[],
}, Error>> {

    const teacherNamesPromise = getUserId(args.startEventId).then(async ({data: userId, error: error}) => {
        if (error) {
            return {data: null, error: error};
        }
        return getTeacherName(userId);
    });

    const pollTitlePromise = getActivityId(args.startEventId).then(async ({data: activityId, error: error}) => {
        if (error) {
            return {data: null, error: error};
        }
        return getPollTitle(activityId);
    });

    const capsuleTitlePromise = getCapsuleId(args.startEventId).then(async ({data: capsuleId, error: error}) => {
        if (error) {
            return {data: null, error: error};
        }
        return getCapsuleTitle(capsuleId);
    });

    const pollDatesPromise = getPollDates(args);

    const [
        {data: teacherNames, error: teacherNamesError},
        {data: pollTitle, error: pollTitleError},
        {data: capsuleTitle, error: capsuleTitleError},
        {data: pollDates, error: pollDatesError},
    ] = await Promise.all([
        teacherNamesPromise,
        pollTitlePromise,
        capsuleTitlePromise,
        pollDatesPromise,
    ]);

    const csvData = [
        {"Teacher": teacherNames?.first_name + " " + teacherNames?.last_name},
        {"Poll title": pollTitle || "No title"},
        {"Capsule title": capsuleTitle?.title || "No title"},
        {"Start date": pollDates?.startDate || "No date"},
        {"End date": pollDates?.endDate || "No date"},
    ];

    return {data: {csvData: csvData}, error: null};
}