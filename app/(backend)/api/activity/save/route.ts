import createClient from "@/supabase/clients/server"
import { adapter } from "../utils"
import { Quiz } from "@/app/_types/quiz"
import { Poll } from "@/app/_types/poll"
import logger from "@/app/_utils/logger"
import { TablesInsert } from "@/supabase/types/database.types"
import { revalidatePath } from "next/cache"


export interface RequestBody {
    id?: number
    activity: Quiz | Poll
}

export interface ResponseBody {
    data: any
    error: string | null
}


export async function POST(request: Request) {
    try {
        const supabase = createClient()

        const { id, activity } = await request.json() as RequestBody

        const activityJson = adapter.toJson(activity)

        const upsert: TablesInsert<'activities'> = {
            id: id,
            type: activity.type,
            object: activityJson,
        }

        logger.log('next:api', 'activity/save', `Saving ${activity.type}${id ? '' + id : ''}...`)

        const { data, error } = await supabase.from('activities').upsert(upsert).select().single()

        if (error || !data) throw new Error(`Error saving ${activity.type}${id ? '' + id : ''}` + (error?.message || 'No data returned'))
            
        revalidatePath('/')
        
        const response = { data, error: null } as ResponseBody
        return new Response(JSON.stringify(response), { headers: { 'content-type': 'application/json' } })

        } catch (error) {
            logger.error('next:api', 'activity/save', error)
            const response = { data: null, error: (error as Error).message } as ResponseBody
            return new Response(JSON.stringify(response), { status: 500, headers: { 'content-type': 'application/json' } })
        }
}