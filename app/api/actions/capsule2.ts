'use server'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger";

export const fetchCapsuleSnapshot = async (capsuleId: string) => {
    const supabase = createClient()
    logger.log('supabase:database', 'Fetching capsule snapshot for capsuleId', capsuleId)
    const { data, error } = await supabase.from('capsules').select('tld_snapshot').eq('id', capsuleId).single()
    if (error) logger.error('supabase:database', 'Error fetching capsule snapshot', error.message)
    return { data, error: error?.message }
}