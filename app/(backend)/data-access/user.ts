import 'server-only'
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'


export async function getUser() {
    const supabase = createClient()
    return await supabase.auth.getUser()
}


export async function getUserRole() {
    const { data: userData, error: userError } = await getUser()

    if (userError || !userData) {
        logger.error('supabase:auth', 'getUserRole', 'error getting user', userError?.message)
        return { role: null, error: userError }
    }

    const supabase = createClient()
    const { data: roleData, error: roleError } = await supabase.from('user_profiles').select('role').eq('id', userData.user.id).single()

    if (roleError || !roleData) {
        logger.error('supabase:auth', 'getUserRole', 'error getting role', roleError?.message)
        return { role: null, error: 'error getting role' + roleError }
    }

    return { role: roleData.role, error: null }
}


export async function getProfile(userId: string) {
    const supabase = createClient()
    return await supabase.from('user_profiles').select().eq('id', userId).limit(1).single()
}

export async function getNames(userId: string) {
    const supabase = createClient()

    let firstName: string | undefined
    let lastName: string | undefined

    const { data: names, error: namesError } = await supabase.from('user_profiles').select('first_name, last_name').eq('id', userId).single()
    if (!namesError) {
        firstName = names?.first_name || undefined
        lastName = names?.last_name || undefined
    }

    return { firstName, lastName }
}


export async function getStripeId(userId: string) {
    const supabase = createClient()
    return await supabase.from('user_profiles').select('stripe_id').eq('id', userId).single()
}


export async function getEmail(userId: string) {
    const supabase = createClient()
    const response = await supabase.auth.admin.getUserById(userId)
    if (response.error) logger.error('supabase:auth', 'getEmail', 'error getting email', response.error.message)
    return response.data?.user?.email
}