'use server'
import createClient from '@/supabase/clients/server'
import logger from "@/app/_utils/logger";
import { Room } from '@/app/api/_actions/room2';
import { cache } from 'react';


export const fetchRoomByCode = cache(async (code: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('code', code).single()
    
    if (error) logger.error('supabase:database', `error getting room by code "${code}"`, error.message)

    return { data, error: error?.message }
})


export const fetchRoomCreator = cache(async (code: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('created_by').eq('code', code).single()

    if (error) logger.error('supabase:database', 'fetchRoomCreator', `error getting room creator by code "${code}"`, error.message)

    return { data, error: error?.message }
})