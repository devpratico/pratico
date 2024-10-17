import 'server-only'
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'
import { customerIsSubscribed } from './stripe'


export async function getRoomCreator(roomId: number) {
    const supabase = createClient()
    const response = await supabase.from('rooms').select('created_by').eq('id', roomId).single()
    if (response.error) logger.error('supabase:database', 'getRoomCreator', 'error getting room creator', response.error.message)
    return response
}


export async function roomCreatorIsPaidCustomer(roomId: number) {
    const { data: creatorData, error: creatorError } = await getRoomCreator(roomId);

    if (creatorError || !creatorData) {
        logger.error('supabase:database', 'RoomCreatorIsPaidCustomer', 'error getting creator', creatorError?.message)
        return false
    }

    const creatorId = creatorData.created_by

    if (!creatorId) return false

    return await customerIsSubscribed(creatorId)
}