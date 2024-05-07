/*
import getSupabaseClient from "../clients/old_getSupabaseClient";
import { User as SupabaseUser, AuthChangeEvent, Session, SignUpWithPasswordCredentials} from "@supabase/supabase-js";

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

export async function fetchUserId(): Promise<string> {
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


export async function signInAnonymously() {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
        throw error
    } else {
        return data
    }
}


interface SignInWithGoogleArgs {
    redirectTo?: string
}

export async function signInWithGoogle(args?: SignInWithGoogleArgs) {
    const supabase =  await getSupabaseClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: args?.redirectTo,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        throw error
    } else {
        return data
    }

}


export async function signInWithEmail(email: string, password: string) {
    const supabase =  await getSupabaseClient()

    try {
        const { data, error } = await supabase.auth.signInWithPassword({email, password})
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error
    }
}
    

export async function signUpNewUser(args: SignUpWithPasswordCredentials) {
    const supabase =  await getSupabaseClient()

    try {
        const { data, error } = await supabase.auth.signUp(args)
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error
    }
}
*/