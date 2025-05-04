import 'server-only'
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'
import { fetchUser } from '../user/user.server'


export async function getUser() {
    const supabase = await createClient()
    return await supabase.auth.getUser()
}


export async function getUserRole() {
    const { data: userData, error: userError } = await getUser()

    if (userError || !userData) {
        logger.error('supabase:auth', 'getUserRole', 'error getting user', userError?.message)
        return { role: null, error: userError }
    }

    const supabase = await createClient()
    const { data: roleData, error: roleError } = await supabase.from('user_profiles').select('role').eq('id', userData.user.id).single()

    if (roleError || !roleData) {
        logger.error('supabase:auth', 'getUserRole', 'error getting role', roleError?.message)
        return { role: null, error: 'error getting role' + roleError }
    }

    return { role: roleData.role, error: null }
}


export const isLoggedIn = async () => {
    const supabase = await createClient()

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