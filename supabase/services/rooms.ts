import { PostgrestError, QueryData } from "@supabase/supabase-js";
import getSupabaseClient from "../clients/getSupabaseClient";
import { Tables, TablesInsert } from "../types/database.types";

// TODO; rename functions to clearly say it happens in the database

export type Room = Tables<'rooms'>
export type RoomInsert = TablesInsert<'rooms'>

/**
 * @returns a room from the `rooms` table
 * @param roomId - The id of the room to get
 */
export async function fetchRoom(roomId: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).single()
    if (error) {
        throw error
    } else {
        return data as Room
    }
}


export async function fetchRoomByName(roomName: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('name', roomName).single()
    if (error) {
        throw error
    } else {
        return data as Room
    }
}


/**
 * Sets a room in the `rooms` table
 */
export async function saveRoom(room: TablesInsert<'rooms'>) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('rooms').upsert(room).select()
    if (error) {
        throw error
    } else {
        return data[0] as Room
    }
}


/**
 * Sets a room snapshot in the `rooms` table
 */
export async function saveRoomSnapshot(roomId: number, snapshot: any) {
    const supabase =  await getSupabaseClient()
    const { error } = await supabase.from('rooms').update({capsule_snapshot: JSON.stringify(snapshot)}).eq('id', roomId)
    if (error) throw error
}

/**
 * Deletes a room from the `rooms` table
 */
export async function deleteRoom(roomId: number) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('rooms').delete().eq('id', roomId)
    if (error) {
        //console.error("error deleting room", error)
        throw error
    } else {
        //logger.log('supabase:database', 'deleted room', roomId)
        return data
    }
}

/**
 * Get rooms related to a capsule
 */
export async function fetchRoomsByCapsuleId(capsuleId: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('capsule_id', capsuleId)
    if (error) {
        //console.error("error getting rooms by capsule id", error.message)
        throw error
    } else {
        const result = data as Room[]
        //logger.log('supabase:database', 'got rooms by capsule id', result.map(r => r.name))
        return result
    }
}