import 'server-only'
import { sanitizeUuid } from '@/app/_utils/utils_functions'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { cache } from "react"
import { customerIsSubscribed } from '../stripe/stripe.server'


export const getRoomId = async (roomCode: string) => {
    logger.log('supabase:database', 'getRoomId', 'roomCode:', roomCode)
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('id').eq('code', roomCode).eq('status', 'open').single()
    if (error) logger.error('supabase:database', 'Error getting room id', error)
    return { id: data?.id, error: error?.message }
}

export const fetchSessionInfoByUser = cache(async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('id, created_at, status, capsule_id').eq('created_by', userId)
    if (error) logger.error('supabase:database', 'Error fetching rooms codes', error.message)
    return { data, error: error?.message }
})

export const fetchRoomsbyUser = cache(async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('id, created_at').eq('created_by', userId)
    if (error) logger.error('supabase:database', 'Error fetching rooms codes', error.message)
    return { data, error: error?.message }
})

export const fetchClosedRoomsCodes = cache(async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('code').eq('status', 'closed')
    if (error) logger.error('supabase:database', 'Error fetching rooms codes', error.message)
    return { data, error: error?.message }
})

export const fetchOpenRoomsCodes = cache(async () => {
    logger.log('supabase:database', 'fetchOpenRoomsCodes')
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('code').eq('status', 'open')
    if (error) logger.error('supabase:database', 'Error fetching rooms codes', error.message)
    return { data, error: error?.message }
})

export const fetchRoomDate = cache(async (roomId: number) => {
    if (!roomId)
        return ({ data: null, error: 'fetchRoom: roomId missing' })
    logger.debug("next:api", "fetchRoomsByroomId", roomId, "sanitized: ", roomId);
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('created_at').eq('id', roomId).single();
    if (error) logger.error('supabase:database', 'Error fetching rooms by room id', error.message)
    return { data, error: error?.message }
})

export const fetchRoomsByCapsuleId = cache(async (capsuleId: string) => {

	if (!capsuleId)
        return ({ data: null, error: 'fetchRoomsByCapsuleId: capsuleId missing' })
    logger.debug("next:api", "fetchRoomsByCapsuleId", capsuleId);

    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('capsule_id', capsuleId)
    if (error) logger.error('supabase:database', 'Error fetching rooms by capsule id', error.message)
    return { data, error: error?.message }
})


export const fetchRoomParams = cache(async (roomId: number) => {
    logger.log('supabase:database', 'fetchRoomParams', 'roomId:', roomId)
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('params').eq('id', roomId).single()
    if (error) logger.error('supabase:database', 'Error fetchRoomParams', error.message)
    return { data, error: error?.message }
})





export const fetchOpenRoomByCode = async (code: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('code', code).eq('status', 'open').single()
    if (error) logger.error('supabase:database', `error getting room by code "${code}"`, error.message)
    return { data, error: error?.message || null }
}

export const fetchRoomByCode = async (code: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('code', code).order('end_of_session', { ascending: false } ).limit(1).single();
    console.log("fetchRoomByCode", data, error);
    
    if (error) logger.error('supabase:database', `error getting room by code "${code}"`, error.message)
    return { data, error: error?.message || null }
}



export const fetchRoomCreator = async (code: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('created_by').eq('code', code).single()

    if (error) logger.error('supabase:database', 'fetchRoomCreator', `error getting room creator by code "${code}"`, error.message)

    return { data, error: error?.message }
}

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

export async function isRoomOpen(roomId: string) {
	const supabase = createClient()
    const numRoomId = Number(roomId)
	const { data, error } = await supabase.from('rooms').select('status').eq('id', numRoomId).single()
	if (error)
		logger.error('supabase:database', 'isRoomOpen', 'error getting room status', error.message)
	return (data?.status === 'open');
};