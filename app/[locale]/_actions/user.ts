'use server'
import createClient from '@/supabase/clients/server'
import logger from "@/app/_utils/logger";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Tables } from '@/supabase/types/database.types';


export type User = SupabaseUser

export interface Names {
    first_name: string | null
    last_name: string  | null
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
        logger.log('supabase:database', `no names for user ${userId.slice(0,5)}...`, error.message)
        //throw error
        return { first_name: null, last_name: null }
    } else {
        logger.log('supabase:database', `fetched names for user ${userId.slice(0, 5)}...`, data?.first_name, data?.last_name)
        return data as Names
    }
}


/**
 * @returns Data from the `user_profiles` table
 */
export async function fetchProfile(userId: string): Promise<Tables<'user_profiles'>> {
    const supabase = createClient()
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).returns<Tables<'user_profiles'>>().single()
    if (error) {
        logger.error('supabase:database', `error fetching profile for user ${userId.slice(0,5)}...`, error.message)
        throw error
    } else {
        logger.log('supabase:database', `fetched profile for user ${userId.slice(0,5)}...`)
        return data
    }
}


/**
 * Get Stripe ID from the `user_profiles` table
 */
export async function fetchStripeId(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from('user_profiles').select('stripe_id').eq('id', userId).single()
    if (error || !data) {
        logger.error('supabase:database', `error fetching stripe id for user ${userId.slice(0,5)}...`, error?.message)
        throw error || new Error("No data")
    } else {
        logger.log('supabase:database', `fetched stripe id for user ${userId.slice(0,5)}...`, data.stripe_id)
        return data.stripe_id as string | null
    }
}


/**
 * Completes the `stripe_id` column in the `user_profiles` table
 */
export async function saveStripeId(userId: string, stripeId: string) {
    const supabase = createClient()
    //const { data, error } = await supabase.from('user_profiles').update({ stripe_id: stripeId }).eq('id', userId)
    // Upsert instead (create row if it doesn't exist)
    const { data, error } = await supabase.from('user_profiles').upsert({ id: userId, stripe_id: stripeId })
    if (error) {
        console.error("error setting stripe id", error)
        throw error
    } else {
        return data
    }
}