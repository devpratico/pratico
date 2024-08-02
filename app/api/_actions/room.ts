'use server'
import createClient from "@/supabase/clients/server"
import { redirect } from "@/app/_intl/intlNavigation"
import logger from "@/app/_utils/logger"
import { fetchRoomParams, saveRoomParams } from "@/app/api/_actions/room2"
import { cache } from "react"


interface stopRoomArgs {
    roomId: number
    capsuleId: string
}


export const stopRoom = cache(async ({ roomId, capsuleId }: stopRoomArgs) => {
    const supabase = createClient()
    const { error } = await supabase.from('rooms').delete().eq('id', roomId)
    if (error) {
        logger.error('supabase:database', 'Error stopping room', error)
        return { error: error.message }
    }

    redirect(`/capsule/${capsuleId}`)
    return { error: null }
})


export const getRoomId = cache(async (roomCode: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('rooms').select('id').eq('code', roomCode).single()
    if (error) logger.error('supabase:database', 'Error getting room id', error)
    return { id: data?.id, error: error?.message }
})


interface toggleCollaborationForArgs {
    userId: string
    roomCode: string
}


export const toggleCollaborationFor = cache(async ({ userId, roomCode }: toggleCollaborationForArgs) => {
    const { id: roomId } = await getRoomId(roomCode.toString())
    if (!roomId) {
        logger.error('supabase:database', `No roomId - can't toggle collaboration for user`)
        return
    }
    const {data, error} = await fetchRoomParams(roomId)
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

    return await saveRoomParams(roomId, params)
})


interface toggleCollaborationForAllArgs {
    roomCode: string
    /**
     * We need all users in order to allow them all when needed
     * (Not 100% satisfied with this)
     */
    allUsersIds: string[]
}


export const toggleCollaborationForAll = cache(async ({ roomCode, allUsersIds }: toggleCollaborationForAllArgs) => {
    //const roomId = await getRoomId(roomCode.toString())
    const { id: roomId } = await getRoomId(roomCode.toString())
    if (!roomId) {
        logger.error('supabase:database', `No roomId - can't toggle collaboration for all`)
        return { data: null, error: 'No roomId' }
    }

    const {data, error } = await fetchRoomParams(roomId)

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
})