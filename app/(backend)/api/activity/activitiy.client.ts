'use server'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { Quiz } from "@/app/_types/quiz"
import { Poll } from "@/app/_types/poll"
import { adapter } from "./utils"
import { TablesInsert } from "@/supabase/types/database.types"
import { revalidatePath } from "next/cache"
import { fetchActivity } from "./activity.server"


export async function deleteActivity(id: number) {
    const supabase = createClient()
    logger.log('supabase:database', `Deleting activity ${id}...`)

    const { error } = await supabase.from('activities').delete().eq('id', id).single()
    if (error) logger.error('supabase:database', `Error deleting activity ${id}`, error.message)

    return { error: error?.message }
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


