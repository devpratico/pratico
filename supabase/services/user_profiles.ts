/*
import getSupabaseClient from "../clients/old_getSupabaseClient";


export async function fetchProfile(userId: string) {
    const supabase =  await getSupabaseClient()
    return supabase.from('user_profiles').select('*').eq('id', userId)
}



export async function fetchStripeId(userId: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('user_profiles').select('stripe_id').eq('id', userId)
    if (error) {
        console.error("error getting stripe id", error)
        throw error
    } else {
        return data
    }
}



export async function saveStripeId(userId: string, stripeId: string) {
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
*/