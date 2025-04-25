'use server'
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'
import { revalidatePath } from 'next/cache'
import { User } from '@supabase/supabase-js'
import { isUserAnonymous as isUserAnonymousServer } from './auth.server'
import { sendDiscordMessage } from '../discord/discord.server'
import { send } from 'process'



export interface LoginArgs {
    email: string
    password: string
}

export interface LoginReturn {
    user: User | null
    error: string | null
}


/**
 * Log in an existing user
 */
export const login = async ({ email, password }: LoginArgs): Promise<LoginReturn> => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) { revalidatePath('/', 'layout') }

    sendDiscordMessage(`🔑 **Connexion** de __${email}__`)

    return { user: data?.user, error: error?.message || null }
}


export interface SignUpArgs extends LoginArgs { }
export interface SignUpReturn extends LoginReturn { }

/**
 * Create a new user
 */
export const signup = async ({ email, password }: SignUpArgs): Promise<SignUpReturn> => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password })
    revalidatePath('/', 'layout')

    sendDiscordMessage(`🎉 **Nouvel inscrit !** ${email}`)

    return { user: data?.user, error: error?.message || null }
}

// TODO: delete
export const signInAnonymously = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInAnonymously({})

    if (error) logger.error('supabase:auth', 'error signing in anonymously', error.message)
	revalidatePath('/', 'layout')

    return { data, error: error?.message }
}


export const signOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) logger.error('supabase:auth', 'Error signing out', error.message)
    revalidatePath('/', 'layout')
    return { error: error?.message }
}


export const updateUserPassword = async (password: string) => {
    const supabase = createClient()
    
    const { data: {user} } = await supabase.auth.getUser()
    sendDiscordMessage(`🔑 **Changement de mot de passe** pour ${user?.email}`)

    const { error } = await supabase.auth.updateUser({ password })
    if (error) logger.error('supabase:auth', 'Error updating user password', error.message)

    return { error: error?.message }
}

export async function isUserAnonymous() {
    return await isUserAnonymousServer()
}