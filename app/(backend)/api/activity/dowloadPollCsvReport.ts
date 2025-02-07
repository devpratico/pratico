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
        return { data: null, error: new Error("Error fetching start event data") };
    }



    // Find the corresponding end event.
    // It is the next event of type end poll in the same room.
    const endEventData = await supabase
        .from("room_events")
        .select()
        .eq("room_id", startEventData.
        .eq("type", "end_poll")
        .gt("created_at", startEventData.created_at)
        .order("created_at", { ascending: true })
        .single();
}