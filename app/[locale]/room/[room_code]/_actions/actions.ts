'use server'
import createClient from '@/supabase/clients/server'
import logger from "@/app/_utils/logger";
import { Room } from '@/app/[locale]/capsule/[capsule_id]/actions';



export async function fetchRoomByCode(code: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('code', code).single()
    
    if (error) {
        logger.error('supabase:database', `error getting room by code "${code}"`, error.message)
        throw error

    } else {
        logger.log('supabase:database', `fetched data for room ${code}`)
        return data as Room
    }
}


export async function fetchRoomCreator(code: string): Promise<string | undefined> {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('created_by').eq('code', code).single()

    if (error) {
        logger.error('supabase:database', 'fetchRoomCreator', `error getting room creator by code "${code}"`, error.message)
        return undefined

    } else {
        logger.log('supabase:database', 'fetchRoomCreator', `${code} created by ${data.created_by}`)
        return data.created_by as string
    }
}