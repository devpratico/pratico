'use server'
import createClient from '@/supabase/clients/server'
import logger from "@/app/_utils/logger";
import { User as SupabaseUser } from "@supabase/supabase-js";


export type User = SupabaseUser

export interface Names {
    first_name: string
    last_name: string
}

export async function fetchUser(): Promise<SupabaseUser> {
    const supabase = createClient()
    try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            throw error
        } else {
            logger.log('supabase:auth', `fetched user`, data.user.email || data.user.is_anonymous && "Anonymous" + data.user.id)
            return data.user as SupabaseUser
        }
    } catch (error) {
        logger.error('supabase:auth', `error fetching user`, (error as Error).message)
        throw error
    }
}


export async function fetchNames(userId: string): Promise<Names> {
    const supabase = createClient()
    const { data, error } = await supabase.from('user_profiles').select('first_name, last_name').eq('id', userId).single()
    if (error) {
        logger.error('supabase:database', `error getting names for user ${userId.slice(0,5)}...`, error.message)
        throw error
    } else {
        logger.log('supabase:database', `fetched names for user ${userId.slice(0, 5)}...`, data?.first_name, data?.last_name)
        return data as Names
    }
}