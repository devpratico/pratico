'use server'
import createClient from '@/supabase/clients/server'
import logger from "@/app/_utils/logger";
import { User as SupabaseUser } from "@supabase/supabase-js";


export type User = SupabaseUser

export interface Names {
    first_name: string | null
    last_name: string  | null
}

export async function getSession(): Promise<SupabaseUser> {
    const supabase = createClient()
    try {
        // Using getSession instead of getUser to avoid a server call. I think it is safe because the auth token
        // can't be spoofed, thanks to the middleware refreshing it for every request.
        const { data:{session}, error } = await supabase.auth.getSession()
        if (error || !session) {
            throw error || new Error("No session")
        } else {
            logger.log('supabase:auth', `fetched session`, session.user.email || session.user.is_anonymous && "Anonymous" + session.user.id)
            return session.user as SupabaseUser
        }
    } catch (error) {
        logger.error('supabase:auth', `error fetching session`, (error as Error).message)
        throw error
    }
}


export async function fetchUser(): Promise<SupabaseUser> {
    const supabase = createClient()
    try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
            throw error || new Error("No session")
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
        logger.log('supabase:database', `no names for user ${userId.slice(0,5)}...`, error.message)
        //throw error
        return { first_name: null, last_name: null }
    } else {
        logger.log('supabase:database', `fetched names for user ${userId.slice(0, 5)}...`, data?.first_name, data?.last_name)
        return data as Names
    }
}