'use server'
import { revalidatePath } from 'next/cache'
import createClient from '@/supabase/clients/server'
import { TablesInsert } from '@/supabase/types/database.types'


interface Credentials {
    email: string
    password: string
}

export async function login({ email, password }: Credentials) {
    const supabase = createClient()

    
    try {
        const { error } = await supabase.auth.signInWithPassword({email, password})
        if (error) {
            throw error
        }
    } catch (error) {
        throw error
    }

    revalidatePath('/', 'layout')
}




export async function signup({ email, password }: Credentials) {
    const supabase = createClient()

    try {
        const { error } = await supabase.auth.signUp({email, password})
        if (error) {
            throw error
        }
    } catch (error) {
        throw error
    }

    revalidatePath('/', 'layout')
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


export async function logOut() {
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

export async function isUserAnonymous() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    return data?.user?.is_anonymous
}