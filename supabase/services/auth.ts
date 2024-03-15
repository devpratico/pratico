import getSupabaseClient from "../clients/getSupabaseClient";
import { User as SupabaseUser, AuthChangeEvent, Session} from "@supabase/supabase-js";

//const supabase =  await getSupabaseClient()
export type User = SupabaseUser // TODO : ideally abstract away this type, front-end shouldn't know about supabase stuff


export async function signOut() {
    const supabase =  await getSupabaseClient()
    await supabase.auth.signOut()
}

export async function fetchUser() {
    const supabase =  await getSupabaseClient()
    try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            throw error
        } else {
            return data.user
        }
    } catch (error) {
        throw error
    }
}

export async function fetchUserId() {
    try {
        const user = await fetchUser()
        return user.id
    } catch (error) {
        throw error
    }
}

export async function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const supabase =  await getSupabaseClient()
    return supabase.auth.onAuthStateChange(callback)
}