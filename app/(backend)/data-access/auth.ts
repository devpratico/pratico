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