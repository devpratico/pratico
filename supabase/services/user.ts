import getSupabaseClient from "./getSupabaseClient";
import { User as SupabaseUser} from "@supabase/supabase-js";

// Export types
export type User = SupabaseUser


// Export functions
export async function signOut() {
    const supabase = await getSupabaseClient()
    await supabase.auth.signOut()
}

export async function getUser() {
    const supabase = await getSupabaseClient()
    return supabase.auth.getUser()
}

export async function getProfile(userId: string) {
    const supabase = await getSupabaseClient()
    return supabase.from('user_profiles').select('name').eq('id', userId)
}

export async function onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = await getSupabaseClient()
    return supabase.auth.onAuthStateChange(callback)
}