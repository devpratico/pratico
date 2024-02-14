import getSupabaseClient from "../clients/getSupabaseClient";
import { User as SupabaseUser} from "@supabase/supabase-js";

//const supabase =  await getSupabaseClient()
export type User = SupabaseUser // TODO : ideally abstract away this type, front-end shouldn't know about supabase stuff


export async function signOut() {
    const supabase =  await getSupabaseClient()
    await supabase.auth.signOut()
}

export async function getUser() {
    const supabase =  await getSupabaseClient()
    return supabase.auth.getUser()
}

export async function getUserId() {
    const res = await getUser()
    const { data, error } = res
    if (error || !data?.user.id) {
        console.error("error getting user id", error)
        throw error
    }
    return data.user.id
}

export async function onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase =  await getSupabaseClient()
    return supabase.auth.onAuthStateChange(callback)
}

/**
 * @returns Data from the `user_profiles` table
 */
export async function getProfile(userId: string) {
    const supabase =  await getSupabaseClient()
    return supabase.from('user_profiles').select('*').eq('id', userId)
}


/**
 * Get Stripe ID from the `user_profiles` table
 */
export async function getStripeId(userId: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('user_profiles').select('stripe_id').eq('id', userId)
    if (error) {
        console.error("error getting stripe id", error)
        throw error
    } else {
        return data
    }
}


/**
 * Completes the `stripe_id` column in the `user_profiles` table
 */
export async function setStripeId(userId: string, stripeId: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('user_profiles').update({ stripe_id: stripeId }).eq('id', userId)
    if (error) {
        console.error("error setting stripe id", error)
        throw error
    } else {
        return data
    }
}
