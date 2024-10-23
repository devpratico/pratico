'use server'
import { revalidatePath } from 'next/cache'
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'
import { fetchUser } from './user'


interface Credentials {
    email: string
    password: string
}

/**
 * Log in an existing user
 */
export const login = async ({ email, password }: Credentials) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) { revalidatePath('/', 'layout')}

    return { user: data?.user, error: error?.message }
}



/**
 * Create a new user
 */
export const signup = async ({ email, password }: Credentials) => {
    const supabase = createClient()
    const { data, error } =  await supabase.auth.signUp({ email, password })
    return { user: data?.user, error: error?.message }
}


export const signInAnonymously = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInAnonymously({})

    if (error) logger.error('supabase:auth', 'error signing in anonymously', error.message)
    revalidatePath('/', 'layout')

    return { data, error: error?.message }
}


//export async function setNames({ id, first_name, last_name }: TablesInsert<'user_profiles'>) {
export const setNames = async ({ id, first_name, last_name }: { id: string, first_name: string, last_name: string }) => {
    const supabase = createClient()
    const { error } = await supabase.from('user_profiles').upsert({id, first_name, last_name})
    if (error) logger.error('supabase:database', 'Error setting names', error.message)
    return { error: error?.message }
}



export const isLoggedIn = async () => {
    const supabase = createClient()

    try {
        const user = supabase.auth.getUser()
        return { user, error: null }
    } catch (error) {
        return { user: null, error: (error as Error).message }
    }   
}

export const isUserAnonymous = async () => {
    const { user, error } = await fetchUser()
    return !!(user?.is_anonymous)
}



export const updateUserPassword = async (password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) logger.error('supabase:auth', 'Error updating user password', error.message)
    return { error: error?.message }
}