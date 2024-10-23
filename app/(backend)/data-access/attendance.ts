import 'server-only'
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'


export async function countAttendances(roomId: number) {
    const supabase = createClient()
    const response = await supabase.from('attendance').select('id').eq('room_id', roomId)
    if (response.error) {
        logger.error('supabase:database', 'countAttendances', 'error counting attendances', response.error.message, 'discord')
        return 0
    }
    return response.data.length
}