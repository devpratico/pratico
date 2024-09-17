'use server'
import createClient from '@/supabase/clients/server'
import logger from "@/app/_utils/logger";
import { User } from "@supabase/supabase-js";
import { Tables } from "@/supabase/types/database.types";
import { cache } from 'react';


export interface Names {
    first_name: string | null
    last_name: string  | null
}

//export async function getSession(): Promise<User> {
/*
export const getSession = cache(async () => {
    const supabase = createClient()
    try {
        // Using getSession instead of getUser to avoid a server call. I think it is safe because the auth token
        // can't be spoofed, thanks to the middleware refreshing it for every request.
        const { data:{session}, error } = await supabase.auth.getSession()
        if (error || !session) {
            throw error || new Error("No session")
        } else {
            logger.log('supabase:auth', `fetched session`, session.user.email || session.user.is_anonymous && "Anonymous " + session.user.id)
            return session.user as User
        }
    } catch (err) {
        logger.error('supabase:auth', `error fetching session`, (err as Error).message)
        throw err
    }
})*/


export const fetchUser =  cache(async () => {
    const supabase = createClient()
    const { data: {user}, error } = await supabase.auth.getUser()
    if (error) logger.error('supabase:auth', `error fetching user`, error.message)
    if (user)  logger.log('supabase:auth', `fetched user`, user.email || user.is_anonymous && "Anonymous " + user.id)
    return ({ user, error: error?.message || null })
})

export const fetchNames = cache(async (userId: string): Promise<Names> => {
    const supabase = createClient()
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
export const fetchProfile = cache(async (userId: string)  => {
    const supabase = createClient()
    const {data, error} = await supabase.from('user_profiles').select('*').eq('id', userId).limit(1).single()
    if (error) logger.error('supabase:database', `error fetching profile for user ${userId.slice(0, 5)}...`, error.message)
    return { data, error: error?.message }
})


/**
 * Get Stripe ID from the `user_profiles` table
 */
export const fetchStripeId = cache(async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('user_profiles').select('stripe_id').eq('id', userId).single()
    if (error) logger.error('supabase:database', `error fetching stripe id for user ${userId.slice(0, 5)}...`, error.message)
    return { data, error: error?.message }
})


/**
 * Completes the `stripe_id` column in the `user_profiles` table
 */
export const saveStripeId = async (userId: string, stripeId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('user_profiles').upsert({ id: userId, stripe_id: stripeId })
    if (error) logger.error('supabase:database', `error saving stripe id for user ${userId.slice(0, 5)}...`, error.message)
    return { error: error?.message }
}

export const getUserByEmail = cache( async (email: string) => {
	const supabase = createClient();
	const { data } = await supabase.auth.getUser();
	if (data?.user && data.user.email?.toString() === email)
		return (data.user);
	return (undefined)
})