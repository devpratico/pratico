import getSupabaseClient from "../clients/getSupabaseClient";


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
    //const { data, error } = await supabase.from('user_profiles').update({ stripe_id: stripeId }).eq('id', userId)
    // Upsert instead (create row if it doesn't exist)
    const { data, error } = await supabase.from('user_profiles').upsert({id: userId, stripe_id: stripeId})
    if (error) {
        console.error("error setting stripe id", error)
        throw error
    } else {
        return data
    }
}
