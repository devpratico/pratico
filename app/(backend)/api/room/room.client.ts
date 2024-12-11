'use server'
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'
import { revalidatePath } from 'next/cache'
import { getRoomId, fetchRoomParams, fetchOpenRoomsCodes, fetchOpenRoomByCode as fetchOpenRoomByCodeServer } from './room.server'
import { TablesInsert, Tables, Json } from '@/supabase/types/database.types'
import { ActivitySnapshot } from '@/app/_types/activity'
import { generateRandomCode } from '@/app/_utils/codeGen'
import { fetchUser } from '../user/user.server'
import { fetchActivity } from '../activity/activity.server'
import { RoomParams } from './types'


export type RoomInsert = TablesInsert<'rooms'>
export type Capsule = Tables<'capsules'>
// TODO: use the same Omit technique for the capsule object, and remove thge unneccessary Json[] array type in supabase


export const stopRoom = async (roomId: number) => {
    const supabase = createClient()

    const { error } = await supabase.from('rooms').update({ status: 'closed' }).eq('id', roomId)
    if (error) {
        logger.error('supabase:database', 'Error stopping room', error)
        return { error: error.message }
    }

    return { error: null }
}

interface toggleCollaborationForArgs {
    userId: string
    roomCode: string
}


export const toggleCollaborationFor = async ({ userId, roomCode }: toggleCollaborationForArgs) => {
    const { id: roomId } = await getRoomId(roomCode.toString())
    if (!roomId) {
        logger.error('supabase:database', `No roomId - can't toggle collaboration for user`)
        return
    }
    const { data, error } = await fetchRoomParams(roomId)
    if (error) {
        logger.error('supabase:database', 'Error fetching room params', error)
        return
    }

    let params = data?.params as any

    if (!params || !params?.collaboration) {
        logger.error('supabase:database', `No params object found - can't toggle collaboration for user`)
        return
    }

    params.collaboration.allowAll = false // reset allowAll - we are now in 'manual' mode

    if (params.collaboration.allowedUsersIds.includes(userId)) {
        logger.log('supabase:database', 'removing user from allowed collab users', userId)
        params.collaboration.allowedUsersIds = params.collaboration.allowedUsersIds.filter((e: string) => e !== userId)

    } else {
        logger.log('supabase:database', 'adding user to allowed collab users', userId)
        params.collaboration.allowedUsersIds.push(userId)
    }

    const { data: saveData, error: saveError } = await saveRoomParams(roomId, params)


}


interface toggleCollaborationForAllArgs {
    roomCode: string
    /**
     * We need all users in order to allow them all when needed
     * (Not 100% satisfied with this)
     */
    allUsersIds: string[]
}


export const toggleCollaborationForAll = async ({ roomCode, allUsersIds }: toggleCollaborationForAllArgs) => {
    //const roomId = await getRoomId(roomCode.toString())
    const { id: roomId } = await getRoomId(roomCode.toString())
    if (!roomId) {
        logger.error('supabase:database', `No roomId - can't toggle collaboration for all`)
        return { data: null, error: 'No roomId' }
    }

    const { data, error } = await fetchRoomParams(roomId)

    if (error) {
        logger.error('supabase:database', 'Error fetching room params', error)
        return { data: null, error: error }
    }

    let params = data?.params as any

    params.collaboration.allowAll = !params.collaboration.allowAll

    // if we are disabling allowAll, we need to reset the allowed users
    if (!params.collaboration.allowAll) {
        params.collaboration.allowedUsersIds = []
    } else {
        // if we are enabling allowAll, we need to add all users to the allowed users.
        params.collaboration.allowedUsersIds = allUsersIds
    }


    return await saveRoomParams(roomId, params)
}



const saveRoom = async (room: RoomInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').upsert(room).select()
    if (error) logger.error('supabase:database', 'Error saving room', error.message)
    return { data, error: error?.message }
}


export const deleteRoom = async (roomId: number) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').delete().eq('id', roomId)
    if (error) logger.error('supabase:database', 'Error deleting room', error.message)
    if (!error) revalidatePath('/')
    return { data, error: error?.message }
}




export const createRoom = async (capsuleId: string) => {
    const supabase = createClient()
    const { user, error: userError } = await fetchUser()
    if (userError) return { room: null, error: userError }
    if (!user) return { room: null, error: 'No user' }

    //const { data, error } = await fetchCapsuleSnapshot(capsuleId)
    //const snapshot = data?.tld_snapshot?.[0]
    //if (error) return { room: null, error }
    //if (!snapshot) return { room: null, error: 'No capsule snapshot to use for room' }

    // Get the snapshot to use for the room
    logger.log('supabase:database', 'Fetching capsule snapshot for capsuleId', capsuleId)
    const { data, error } = await supabase.from('capsules').select('tld_snapshot').eq('id', capsuleId).single()
    if (error) logger.error('supabase:database', 'Error fetching capsule snapshot', error.message)

    const snapshot = data?.tld_snapshot?.[0]


    let code = generateRandomCode()

    // Ensure the code is unique
    const { data: existingCodes, error: errorCodes } = await fetchOpenRoomsCodes()
    if (existingCodes) {
        while (existingCodes.includes({ code })) {
            code = generateRandomCode()
        }
    }

    // generate room params
    const params: RoomParams = {
        navigation: { type: 'animateur', follow: user.id },
        collaboration: { active: true, allowAll: false, allowedUsersIds: [] }
    }

    // Generate the room object
    const room: RoomInsert = {
        code: code,
        capsule_id: capsuleId,
        capsule_snapshot: snapshot,
        params: params as unknown as Json,
        status: 'open',
    }

    // Set the room in the database, and get the room that is created
    const { data: createdRoomA, error: errorRoom } = await saveRoom(room)

    if (errorRoom) return { room: null, error: errorRoom }
    if (!createdRoomA) return { room: null, error: 'saveRomm returned no room' }

    // Not sure why this is an array, but we only want the first element
    const createdRoom = createdRoomA[0]

    // Revalidate cache
    //revalidatePath(`/room/${createdRoom.code}`)

    return { room: createdRoom, error: null }
}


export const saveRoomSnapshot = async (roomId: number, snapshot: any) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').update({ capsule_snapshot: snapshot as unknown as Json }).eq('id', roomId)
    if (error) logger.error('supabase:database', 'Error saving room snapshot', error.message)
    return { data, error: error?.message }
}


export const saveRoomParams = async (roomId: number, params: RoomParams) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').update({ params: params as unknown as Json }).eq('id', roomId)
    if (error) logger.error('supabase:database', 'Error saveRoomParams', error.message)
    return { data, error: error?.message }
}


export const saveRoomActivitySnapshot = async (roomId: number, snapshot: ActivitySnapshot | null) => {
    const supabase = createClient()

    logger.log('supabase:database', 'saveRoomActivitySnapshot', 'saving snapshot in room...', 'roomId:', roomId, 'snapshot:', snapshot)

    const { data, error } = await supabase.from('rooms').update({
        activity_snapshot: snapshot ? snapshot as unknown as Json : null
    }).eq('id', roomId).eq('status', 'open')

    if (error) logger.error('supabase:database', 'Error saving room activity snapshot', error.message)


    return { data, error: error?.message || null }
}


/**
 * Generates an initial 'snapshot' object for the activity.
 * This object represents the state of the activity when it is started.
 */
export const generateInitialActivitySnapshot = async (activityId: number): Promise<{ snapshot: ActivitySnapshot | null, error: string | null }> => {
    logger.log('supabase:database', 'generateInitialActivitySnapshot', 'activityId:', activityId)

    const { user } = await fetchUser()
    if (!user) {
        logger.error('supabase:database', 'generateInitialActivitySnapshot', 'No user authenticated')
        return { snapshot: null, error: 'No user authenticated' }
    }

    const { data: activity, error: activityError } = await fetchActivity(activityId)
    if (activityError || !activity) {
        logger.error('supabase:database', 'generateInitialActivitySnapshot', 'No activity found')
        return { snapshot: null, error: activityError || 'No activity found' }
    }

    const firstQuestionId = Object.keys(activity.object.questions)[0]

    let activitySnapshot: ActivitySnapshot

    // Generate the activity snapshot object
    if (activity.type === 'quiz') {
        activitySnapshot = {
            type: 'quiz',
            activityId: activityId,
            currentQuestionId: firstQuestionId,
            currentQuestionState: 'answering',
            answers: {}
        }
    } else if (activity.type === 'poll') {
        activitySnapshot = {
            type: 'poll',
            activityId: activityId,
            currentQuestionId: firstQuestionId,
            state: 'voting',
            answers: []
        }
    } else {
        logger.log('react:component', 'StartButton', 'Impossible to set activity snapshot, type not recognized:', activity.type)
        return { snapshot: null, error: 'Activity type not recognized' }
    }

    logger.log('supabase:database', 'generateInitialActivitySnapshot', 'activitySnapshot:', activitySnapshot)
    return { snapshot: activitySnapshot, error: null }
}


/**
 * Generates an initial 'snapshot' object for the activity, then saves it in the room row.
 */
export const startActivity = async ({ activityId, roomCode }: { activityId: number, roomCode: string }) => {
    logger.log('supabase:database', 'startActivity', 'activityId:', activityId, 'roomCode:', roomCode)
    const { snapshot, error } = await generateInitialActivitySnapshot(activityId)
    if (error || !snapshot) {
        logger.error('supabase:database', 'startActivity', 'No snapshot generated')
        return { error: error || 'No snapshot generated' }
    }

    const { id: roomId, error: roomIdError } = await getRoomId(roomCode)
    if (roomIdError || !roomId) {
        logger.error('supabase:database', 'startActivity', 'No roomId found')
        return { error: roomIdError || 'No roomId found' }
    }

    const { error: saveError } = await saveRoomActivitySnapshot(roomId, snapshot)
    if (saveError) {
        logger.error('supabase:database', 'startActivity', 'Error saving activity snapshot:', saveError)
        return { error: saveError }
    }

    logger.log('supabase:database', 'startActivity', 'Activity started successfully')
    return { error: null }
}


export async function fetchOpenRoomByCode(code: string) {
    return await fetchOpenRoomByCodeServer(code)
}