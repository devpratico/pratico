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
    const supabase = createClient();
    logger.log('supabase:database', 'fetchActivitiesWidgetData', `Fetching activities widget data for room ${roomId}...`);
    const { data, error } = await supabase.from('activities').select("*").eq('id', roomId);
    const { data: eventData, error: eventError } = await fetchActivitiesDoneInRoom(roomId);
    if (error || !data) {
        logger.error('supabase:database', 'fetchActivitiesWidgetData', `Error fetching activities widget data for room ${roomId}`, error?.message);
        return { data: [], error: error?.message };
    } else if (eventError || !eventData) {
        logger.error('supabase:database', 'fetchActivitiesDoneInRoom', `Error fetching activities done in room ${roomId}`, eventError?.message);
        return { data: [], error: eventError?.message };
    } else if (data.length === 0 || eventData.length === 0) { 
        logger.error('supabase:database', 'fetchActivitiesWidgetData or fetchActivitiesDoneInRoom', `No activities done in room ${roomId}`);
        return { data: [], error: null };
    }

    const activities = Array.from(data.map((item) => {
        let title = "";
        let nbQuestions = 0;
        if (item.object)
        {   
            Object.entries(item.object).map(([key, value]) => {
                
                if (key === 'title')
                    title = value;
                if (key === 'questions')            
                    nbQuestions = value.length;
            });
        }
        const eventActivity = eventData.find((event) => event.activityId === item.id.toString());
        const activity: ActivityTypeWidget = {
            id: item.id,
            type: item.type,
            title: title,
            started_at: eventActivity?.startDate || new Date(),
            stopped_at: eventActivity?.endDate || new Date(),
            percentage: eventActivity?.relevantNumber || 0,
            nbQuestions: nbQuestions
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



