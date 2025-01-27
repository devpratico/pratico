import 'server-only'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { adapter } from './utils'
import { getUser } from '../auth/auth.server'
import { Quiz } from '@/app/_types/quiz'
import { Poll } from '@/app/_types/poll'
import { Tables } from '@/supabase/types/database.types'
import { ActivityTypeTable, ActivityTypeWidget } from '@/app/_types/activity'
import { fetchActivitiesDoneInRoom } from './fetchActivitiesDoneInRoom'
import { act } from 'react'



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

export const fetchActivitiesWidgetData = async (roomId: string) => {
    logger.log('supabase:database', 'fetchActivitiesWidgetData', `Fetching activities widget data for room ${roomId}...`);
    const supabase = createClient();
    const { data, error } = await fetchActivitiesDoneInRoom(roomId);
    if (!data || error) {
        logger.error('supabase:database', 'fetchActivitiesWidgetData', 'fetchActivitiesDoneInRoom', `Error fetching activities for room ${roomId}`, error?.message);
        return { data: [], error: error?.message };
    } else if (data.length === 0) { 
        logger.error('supabase:database', 'fetchActivitiesWidgetData', 'fetchActivitiesDoneInRoom', `No activities done in room ${roomId}`);
        return { data: [], error: null };
    }
    logger.log('supabase:database', 'fetchActivitiesWidgetData', `Activities done in room ${roomId}: ${data.length}, activities: ${data.length}`);
    const activities = Array.from(data.map((item) => {
        logger.log('supabase:database', 'fetchActivitiesWidgetData', `Activity ${item.activityId} (${item.type}) title: ${item.title}`);
        // const { data, error } = supabase.from("activities").select("object->>questions").eq("activityId", item.activityId).eq("type", item.type).then(({ data, error }) => ({ data, error }));
        // if (!data || error)
        //     logger.error('supabase:database', 'fetchActivitiesWidgetData', `Error fetching questions for activity ${item.activityId} (${item.type})`, error?.message);
        // logger.log('supabase:database', 'fetchActivitiesWidgetData', `Activity ${item.activityId} (${item.type}) questions: ${data?.questions}`);
        const activity: ActivityTypeWidget = {
            id: item.activityId,
            type: item.type,
            title: item.title,
            started_at: item.startDate || new Date(),
            stopped_at: item.endDate || new Date(),
            percentage: item.relevantNumber || 0,
            nbQuestions: 0
        }
        return (activity);
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



