import createClient from "@/supabase/clients/client"
import logger from "@/app/_utils/logger"
import { SaveActivityArgs, SaveActivityReturn, DuplicateActivityArgs, DuplicateActivityReturn } from "./activities.server"


// TODO: Migrate this code server-side in activities.server.ts and call it via a route.
export async function deleteActivity(id: number) {
    const supabase = createClient()
    logger.log('supabase:database', `Deleting activity ${id}...`)

    const { error } = await supabase.from('activities').delete().eq('id', id).single()
    if (error) logger.error('supabase:database', `Error deleting activity ${id}`, error.message)

    return { error: error?.message }
}


export async function saveActivity({ id, activity }: SaveActivityArgs): Promise<SaveActivityReturn> {
    try {
        const response = await fetch('/api/activity/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, activity }),
        })

        const { data, error } = await response.json() as SaveActivityReturn
        return { data, error }

    } catch (error) {
        logger.error('next:api', 'activity/save', error)
        return { data: null, error: (error as Error).message }
    }
}

export async function duplicateActivity({ id }: DuplicateActivityArgs): Promise<DuplicateActivityReturn> {
    try {
        const response = await fetch('/api/activity/duplicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })

        const { data, error } = await response.json() as DuplicateActivityReturn

        return { data, error }

    } catch (error) {
        logger.error('next:api', 'activity/duplicateActivity', error)
        return { data: null, error: (error as Error).message }
    }
}


