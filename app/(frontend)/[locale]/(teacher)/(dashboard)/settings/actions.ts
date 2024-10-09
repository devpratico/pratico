'use server'
import createClient from "@/supabase/clients/server"
import { Tables } from "@/supabase/types/database.types"


type Profile = Tables<'user_profiles'>

export async function fetchProfile(userId: string) {
    const supabase = createClient()
    return await supabase.from('user_profiles').select().eq('id', userId).returns<Profile[]>().limit(1).single()
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