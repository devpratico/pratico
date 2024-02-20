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