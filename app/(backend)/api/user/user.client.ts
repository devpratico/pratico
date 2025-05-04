'use server'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { fetchUser as fetchUserServer } from "./user.server"


export const setNames = async ({ id, first_name, last_name }: { id: string, first_name: string, last_name: string }) => {
    const supabase = await createClient()
    const { error } = await supabase.from('user_profiles').upsert({ id, first_name, last_name })
    if (error) logger.error('supabase:database', 'Error setting names', error.message)
    return { error: error?.message }
}



/**
 * Completes the `stripe_id` column in the `user_profiles` table
 */
export const saveStripeId = async (userId: string, stripeId: string) => {
    const supabase = await createClient()
    const { error } = await supabase.from('user_profiles').upsert({ id: userId, stripe_id: stripeId })
    if (error) logger.error('supabase:database', `error saving stripe id for user ${userId.slice(0, 5)}...`, error.message)
    return { error: error?.message }
}


export async function fetchUser() {
    return await fetchUserServer()
}