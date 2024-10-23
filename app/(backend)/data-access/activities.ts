import 'server-only'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { adapter } from '../api/activity/utils'
import { getUser } from './user'
import { Quiz } from '@/app/_types/quiz'
import { Poll } from '@/app/_types/poll'
import { Tables } from '@/supabase/types/database.types'


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




// Supabase returns `Json` instead of `Quiz` or `Poll` objects
// Let's declare the type of data we want to return
interface ReturnedData extends Omit<Tables<'activities'>, 'object'> {
    object: Quiz | Poll
}


export const fetchActivitiesOfCurrentUser = async (limit?: number): Promise<{ data: ReturnedData[], error: string | null }> => {
    const { data: { user: user}, error: userError } = await getUser()
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