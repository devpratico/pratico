'use server'
import createClient from '@/supabase/clients/server'
import { Tables } from "@/supabase/types/database.types";
import logger from "@/app/_utils/logger";


export type Room = Tables<'rooms'>

export async function fetchRoomByCode(code: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('code', code).single()
    
    if (error) {
        logger.error('supabase:database', `error getting room by code "${code}"`, error.message)
        throw error

    } else {
        logger.log('supabase:database', `fetched data for room ${code}`)
        return data as Tables<'rooms'>
    }
}


export async function getUserId() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user.id) {
        logger.error('supabase:auth', `error getting user id`, error?.message)
        throw error
    } else {
        logger.log('supabase:auth', `fetched user id`)
        return data.user.id
    }
}