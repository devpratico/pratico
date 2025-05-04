import 'server-only'
import createClient from '@/supabase/clients/server'
import logger from "@/app/_utils/logger";
import { cache } from 'react';
import { revalidatePath } from 'next/cache';


export interface Names {
    first_name: string | null
    last_name: string | null
}

export const fetchUser = async () => {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) logger.error('supabase:auth', `error fetching user`, error.message)
    if (user) logger.log('supabase:auth', `fetched user`, user.email || user.is_anonymous && "Anonymous " + user.id)
    return ({ user, error: error?.message || null })
}

export const signInAnonymously = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInAnonymously({})

    if (error) logger.error('supabase:auth', 'error signing in anonymously', error.message)
    revalidatePath('/', 'layout')

    return { data, error: error?.message }
}


export const fetchNames = cache(async (userId: string): Promise<Names> => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('user_profiles').select('first_name, last_name').eq('id', userId).single()
    if (error) {
        logger.log('supabase:database', `no names for user ${userId.slice(0, 5)}...`, error.message)
        //throw error
        return { first_name: null, last_name: null }
    } else {
        logger.log('supabase:database', `fetched names for user ${userId.slice(0, 5)}...`, data?.first_name, data?.last_name)
        return data as Names
    }
})

/**
 * @returns Data from the `user_profiles` table
 */
export const fetchProfile = cache(async (userId: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle()
    if (error) logger.error('supabase:database', `error fetching profile for user ${userId.slice(0, 5)}...`, error.message)
    return { data, error: error?.message }
})


/**
 * Get Stripe ID from the `user_profiles` table
 */
export const fetchStripeId = cache(async (userId: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('user_profiles').select('stripe_id').eq('id', userId).maybeSingle()
    if (error) logger.error('supabase:database', `error fetching stripe id for user ${userId.slice(0, 5)}...`, error.message)
    return { data, error: error?.message }
})


export const getUserByEmail = cache(async (email: string) => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data?.user && data.user.email?.toString() === email)
        return (data.user);
    return (undefined)
})