'use server'
import createClient from "@/supabase/clients/server"
import { redirect } from "@/app/_intl/intlNavigation"
import logger from "@/app/_utils/logger"
import { fetchRoomParams, saveRoomParams } from "@/app/api/_actions/room2"


interface stopRoomArgs {
    roomId: number
    capsuleId: string
}

export async function stopRoom({ roomId, capsuleId }: stopRoomArgs) {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').delete().eq('id', roomId)
    if (error) {
        throw error
    } else {
        redirect(`/capsule/${capsuleId}`)
    }
}

async function getRoomId(roomCode: string): Promise<number> {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('id').eq('code', roomCode).single()
    if (error) {
        throw error
    } else {
        return data.id
    }
}


interface toggleCollaborationForArgs {
    userId: string
    roomCode: string
}

export async function toggleCollaborationFor({ userId, roomCode }: toggleCollaborationForArgs) {
    const roomId = await getRoomId(roomCode.toString())
    const params = await fetchRoomParams(roomId)

    params.collaboration.allowAll = false // reset allowAll - we are now in 'manual' mode

    if (params.collaboration.allowedUsersIds.includes(userId)) {
        logger.log('supabase:database', 'removing user from allowed collab users', userId)
        params.collaboration.allowedUsersIds = params.collaboration.allowedUsersIds.filter(e => e !== userId)

    } else {
        logger.log('supabase:database', 'adding user to allowed collab users', userId)
        params.collaboration.allowedUsersIds.push(userId)
    }

    try {
        await saveRoomParams(roomId, params)
        logger.log('supabase:database', 'toggled collaboration for', userId, 'in room', roomId)
    } catch (error) {
        logger.error('supabase:database', 'Error toggling collaboration for', userId, 'in room', roomId, error)
        throw error
    }
}


interface toggleCollaborationForAllArgs {
    roomCode: string
    /**
     * We need all users in order to allow them all when needed
     * (Not 100% satisfied with this)
     */
    allUsersIds: string[]
}

export async function toggleCollaborationForAll({ roomCode, allUsersIds }: toggleCollaborationForAllArgs) {
    const roomId = await getRoomId(roomCode.toString())
    const params = await fetchRoomParams(roomId)

    params.collaboration.allowAll = !params.collaboration.allowAll

    // if we are disabling allowAll, we need to reset the allowed users
    if (!params.collaboration.allowAll) {
        params.collaboration.allowedUsersIds = []
    } else {
        // if we are enabling allowAll, we need to add all users to the allowed users.
        params.collaboration.allowedUsersIds = allUsersIds
    }


    try {
        await saveRoomParams(roomId, params)
        logger.log('supabase:database', 'toggled collaboration for all in room', roomId)
    } catch (error) {
        logger.error('supabase:database', 'Error toggling collaboration for all in room', roomId, error)
        throw error
    }
}