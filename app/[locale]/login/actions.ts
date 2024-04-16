'use server'
import { revalidatePath } from 'next/cache'
import createClient from '@/supabase/clients/server'


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
    } catch (error) {
        throw error
    }

    revalidatePath('/', 'layout')

}