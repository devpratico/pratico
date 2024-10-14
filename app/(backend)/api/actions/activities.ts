'use server'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { revalidatePath } from "next/cache"
import saveActivity from "../activity/save/wrapper"
import { fetchActivity } from "../../data-access/activities"


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