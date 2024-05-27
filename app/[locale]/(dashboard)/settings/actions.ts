'use server'
import createClient from "@/supabase/clients/server"

export async function fetchProfile(userId: string) {
    const supabase = createClient()
    return supabase.from('user_profiles').select('*').eq('id', userId)
}



export async function fetchStripeId(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from('user_profiles').select('stripe_id').eq('id', userId)
    if (error) {
        console.error("error getting stripe id", error)
        throw error
    } else {
        return data
    }
}