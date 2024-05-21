'use server'
import createClient from "@/supabase/clients/server"
import { redirect } from "@/app/_intl/intlNavigation"
import logger from "@/app/_utils/logger"
import { fetchRoomParams, saveRoomParams } from "@/app/[locale]/capsule/[capsule_id]/actions"
import { log } from "console"


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

export async function toggleCollaborationFor(userId: string, roomCode: string) {
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



export async function toggleCollaborationForAll(roomCode: string) {
    const roomId = await getRoomId(roomCode.toString())
    const params = await fetchRoomParams(roomId)

    params.collaboration.allowAll = !params.collaboration.allowAll
    params.collaboration.allowedUsersIds = [] // reset allowed users

    try {
        await saveRoomParams(roomId, params)
        logger.log('supabase:database', 'toggled collaboration for all in room', roomId)
    } catch (error) {
        logger.error('supabase:database', 'Error toggling collaboration for all in room', roomId, error)
        throw error
    }
}