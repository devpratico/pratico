'use server'
import { revalidatePath } from 'next/cache'
import createClient from '@/supabase/clients/server'
import { TablesInsert } from '@/supabase/types/database.types'
import { cache } from 'react'


interface Credentials {
    email: string
    password: string
}

/**
 * Log in an existing user
 */
export async function login({ email, password }: Credentials) {
    const supabase = createClient()

    /*
    try {
        const { error } = await supabase.auth.signInWithPassword({email, password})
        if (error) {
            throw error
        }
    } catch (error) {
        throw error
    }
    */

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) { revalidatePath('/', 'layout')}

    return { user: data?.user, error: error?.message }
}



/**
 * Create a new user
 */
export async function signup({ email, password }: Credentials) {
    const supabase = createClient()

    /*
    try {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error || !data.user) { throw error || new Error('No user returned') }
        return data
    } catch (err) {
        throw err
    }*/

    const { data, error } =  await supabase.auth.signUp({ email, password })

    return { user: data?.user, error: error?.message }
}




export async function signInAnonymously() {
    const supabase = createClient()


    try {
        const { data, error } = await supabase.auth.signInAnonymously({})
        if (error) {
            throw error
        }

        revalidatePath('/', 'layout')

        return data

    } catch (error) {
        throw error
    }
}


export async function setNames({ id, first_name, last_name }: TablesInsert<'user_profiles'>) {
    const supabase = createClient()

    try {
        const { error } = await supabase.from('user_profiles').upsert({id, first_name, last_name})
        if (error) {
            throw error
        }
    } catch (error) {
        throw error
    }

}


export async function signOut() {
    const supabase = createClient()

    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
    } catch (error) {
        throw error
    }
}

export async function isLoggedIn() {
    const supabase = createClient()

    try {
        const user = supabase.auth.getUser()
        return user
    } catch (error) {
        throw error
    }
}

export const isUserAnonymous = cache(async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    return data?.user?.is_anonymous
})