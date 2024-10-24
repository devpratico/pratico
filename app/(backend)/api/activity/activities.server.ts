import 'server-only'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { adapter } from './utils'
import { getUser } from '../../data-access/auth'
import { Quiz } from '@/app/_types/quiz'
import { Poll } from '@/app/_types/poll'
import { Tables } from '@/supabase/types/database.types'
import { TablesInsert } from '@/supabase/types/database.types'
import { revalidatePath } from "next/cache"



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
    const { data: { user: user }, error: userError } = await getUser()
    const userId = user?.id

    if (!userId || userError) {
        logger.error('supabase:database', 'Error fetching user', userError)
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



export interface DuplicateActivityArgs {
    id: number
}

export interface DuplicateActivityReturn {
    data: any // TODO: Define the type of data
    error: string | null
}


export async function duplicateActivity({ id }: DuplicateActivityArgs): Promise<DuplicateActivityReturn> {
    const { data, error } = await fetchActivity(id)
    if (error || !data || !data.object) {
        logger.error('supabase:database', `Error duplicating activity ${id}`, error)
        return { data: null, error: error }
    }

    const activity = data.object
    const { data: savedData, error: saveError } = await saveActivity({ activity })

    if (saveError || !savedData) {
        logger.error('supabase:database', `Error saving duplicated activity ${id}`, saveError)
        return { data: null, error: saveError }
    }

    revalidatePath('/')
    return { data: savedData, error: null }
}



export interface SaveActivityArgs {
    id?: number
    activity: Quiz | Poll
}

export interface SaveActivityReturn {
    data: any // TODO: Define the type of data
    error: string | null
}


export async function saveActivity({ id, activity }: SaveActivityArgs): Promise<SaveActivityReturn> {
    const supabase = createClient()

    const activityJson = adapter.toJson(activity)

    const upsert: TablesInsert<'activities'> = {
        id: id,
        type: activity.type,
        object: activityJson,
    }

    logger.log('next:api', 'activity/save', `Saving ${activity.type}${id ? '' + id : ''}...`)

    const { data, error } = await supabase.from('activities').upsert(upsert).select().single()

    if (error || !data) {
        logger.error('next:api', 'activity/save', `Error saving ${activity.type}${id ? '' + id : ''}`, error?.message)
        return { data: null, error: error?.message }
    }

    revalidatePath('/')
    return { data, error: null }
}