'use server'
import { fetchCapsuleSnapshot, fetchCapsuleTitle, saveSnapshotToCapsules } from '@/supabase/services/capsules'
import { saveRoom, deleteRoom, RoomInsert } from '@/supabase/services/rooms'
import { revalidatePath } from 'next/cache'
//import type { SupabaseError } from '@/supabase/types/errors'


/**
 * Encodes a string for use in a URL (removes spaces and special characters)
 */
function encodeStringForURL(str: string): string {
    return encodeURIComponent(str.replace(/ /g, '')).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}


export async function createRoom(capsuleId: string): Promise<RoomInsert> {
    if (!capsuleId) throw new Error('No capsule id provided for start button')

    const snapshot = await fetchCapsuleSnapshot(capsuleId)
    const name     = await fetchCapsuleTitle(capsuleId)
    const encodedName = encodeStringForURL(name)
    const room: RoomInsert = { name: encodedName, capsule_id: capsuleId, capsule_snapshot: JSON.stringify(snapshot) }

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
        //revalidatePath('/capsules') // So that the router cache is refreshed (new capsule is shown in the list)
    } catch (error) {
        throw error
    }
}