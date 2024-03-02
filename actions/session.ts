'use server'
import { getCapsuleSnapshot, getCapsuleTitle } from '@/supabase/services/capsules'
import { setRoom, deleteRoom, RoomInsert } from '@/supabase/services/rooms'
import type { SupabaseError } from '@/supabase/types/errors'


/**
 * Encodes a string for use in a URL (removes spaces and special characters)
 */
function encodeStringForURL(str: string): string {
    return encodeURIComponent(str.replace(/ /g, '')).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}

export async function startSession(capsuleId: string) {
    if (!capsuleId) throw new Error('No capsule id provided for start button')

    const snapshot = await getCapsuleSnapshot(capsuleId)
    const name     = await getCapsuleTitle(capsuleId)
    const encodedName = encodeStringForURL(name)
    const room: RoomInsert = { name: encodedName, capsule_id: capsuleId, capsule_snapshot: JSON.stringify(snapshot) }

    try {
        setRoom(room)
    } catch (error) {
        throw error
    }
}

export async function stopSession(roomId: number) {
    if (!roomId) throw new Error('No room id provided for stop button')
    try {
        deleteRoom(roomId)
    } catch (error) {
        throw error
    }
}