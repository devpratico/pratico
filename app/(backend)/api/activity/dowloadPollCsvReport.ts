import createClient from "@/supabase/clients/server";
import DatabaseResponse from "@/app/_utils/DatabaseResponse";
import logger from "@/app/_utils/logger";


async function getTeacherName(userId: string) {
    const supabase = createClient();
    return await supabase
        .from("user_profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();
}


async function getPollTitle(activityId: string) {
    const supabase = createClient();
    return await supabase
        .from("activities")
        .select("title")
        .eq("id", activityId)
        .single();
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
}): Promise<DatabaseResponse<{
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
        .eq("type", "end_poll")
        .order("created_at", { ascending: true })
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
}): Promise<DatabaseResponse<{
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
}): Promise<DatabaseResponse<{
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
}): Promise<DatabaseResponse<{
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