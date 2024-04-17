'use server'
import { fetchUserId } from '@/supabase/services/auth';
import { fetchCapsuleSnapshot, saveSnapshotToCapsules } from '@/supabase/services/capsules'
import { saveRoom, deleteRoom, RoomInsert, fetchRoomsCodes, roomParams } from '@/supabase/services/rooms'
import { generateRandomCode } from '@/app/_utils/codeGen';

// TODO: Rappatrier le code supabase ici


export async function createRoom(capsuleId: string): Promise<RoomInsert> {
    if (!capsuleId) throw new Error('No capsule id provided for start button')

    const snapshot = await fetchCapsuleSnapshot(capsuleId)
    let code = generateRandomCode()
    
    // Ensure the code is unique
    const existingCodes = await fetchRoomsCodes()
    while (existingCodes.includes(code)) {
        code = generateRandomCode()
    }

    // generate room params
    const userId = await fetchUserId()
    const params: roomParams = { navigation: { type: 'animateur', follow: userId } }

    // Generate the room object
    const room: RoomInsert = { code: code, capsule_id: capsuleId, capsule_snapshot: JSON.stringify(snapshot), params: JSON.stringify(params) }

    try {
        // Set the room in the database, and get the room that is created
        const createdRoom = await saveRoom(room)
        return createdRoom // We'll need this to set the room in the context
    } catch (error) {
        throw error
    }
}

export async function stopRoom(roomId: number) {
    if (!roomId) throw new Error('No room id provided for stop button')
    try {
        await deleteRoom(roomId)
    } catch (error) {
        throw error
    }
}


export async function saveCapsuleSnapshot(capsuleId: string, snapshot: any) {
    try {
        await saveSnapshotToCapsules(capsuleId, snapshot)
    } catch (error) {
        throw error
    }
}