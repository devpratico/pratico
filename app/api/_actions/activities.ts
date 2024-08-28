'use server'
import createClient from "@/supabase/clients/server"
import { Tables, TablesInsert, Json } from "@/supabase/types/database.types"
import { Quiz, Poll } from "@/app/_hooks/usePollQuizCreation"
import logger from "@/app/_utils/logger"
import { cache } from "react"
import { fetchUser } from "./user"
import { revalidatePath } from "next/cache"


// TODO: Remove the 'type' ('quiz' or 'poll') field from supabase and use the json content ('object' column) instead
// Supabase allows to filter queries by the content of a JSON object field.

const adapter = {
    toJson: (activity: Quiz | Poll) => activity as unknown as Json,

    toQuiz: (json: Json) => {
        if (!json) {
            logger.error('supabase:database', 'Error parsing quiz', 'No JSON provided')
            return undefined
        }

        const rawObject = json as any
        const schemaVersion = rawObject.schemaVersion as string

        switch (schemaVersion) {
            case '1':
                return rawObject as Quiz
            default:
                logger.error('supabase:database', 'Error parsing quiz', 'Unknown schema version')
                return undefined
        }
    },

    toPoll: (json: Json) => {
        if (!json) {
            logger.error('supabase:database', 'Error parsing poll', 'No JSON provided')
            return undefined
        }

        const rawObject = json as any
        const schemaVersion = rawObject.schemaVersion as string

        switch (schemaVersion) {
            case '1':
                return rawObject as Poll
            default:
                logger.error('supabase:database', 'Error parsing poll', 'Unknown schema version')
                return undefined
        }
    }
}


interface saveActivityArgs {
    id?: number
    activity: Quiz | Poll
}

export async function saveActivity({ id, activity }: saveActivityArgs) {
    const supabase = createClient()

    const upsert: TablesInsert<'activities'> = {
        id: id,
        type: activity.type,
        object: adapter.toJson(activity)
    }

    logger.log('supabase:database', `Saving ${activity.type}${id ? ''+id : ''}...`)
    const { data, error } = await supabase.from('activities').upsert(upsert).select().single()
    if (error || !data) logger.error('supabase:database', `Error saving ${activity.type}${id ? ''+id : ''}`, error?.message)
    
    revalidatePath('/')
    return { data, error: error?.message }
}

// Supabase returns `Json` instead of `Quiz` or `Poll` objects
// Let's declare the type of data we want to return
interface ReturnedData extends Omit<Tables<'activities'>, 'object'> {
    object: Quiz | Poll
}
/*interface ReturnedData<T extends Quiz | Poll> extends Omit<Tables<'activities'>, 'object'> {
    object: T
}*/


//export const fetchActivity = cache(async <T extends Quiz | Poll>(id: number): Promise<{ data: ReturnedData<T> | null, error: string | null }> => {
export const fetchActivity = cache(async (id: number) => {
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
            return { data: { ...data, object: adapter.toQuiz(data.object) }, error: null }
        case 'poll':
            return { data: { ...data, object: adapter.toPoll(data.object) }, error: null }
        default:
            return { data: null, error: 'Unknown activity type' }
    }
})






export const fetchActivitiesOfCurrentUser = cache(async (limit?: number): Promise<{ data: ReturnedData[], error: string | null }> => {
    const { user: user, error: userError } = await fetchUser()
    const userId = user?.id

    if (!userId || userError) {
        logger.error('supabase:database', 'Error fetching user', userError)
        return { data: [], error: userError}
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
})


export async function deleteActivity(id: number) {
    const supabase = createClient()
    logger.log('supabase:database', `Deleting activity ${id}...`)

    const { error } = await supabase.from('activities').delete().eq('id', id).single()
    if (error) logger.error('supabase:database', `Error deleting activity ${id}`, error.message)

    revalidatePath('/')
    return { error: error?.message }
}


export async function duplicateActivity(id: number) {
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