import getSupabaseClient from "../clients/getSupabaseClient";
import { Tables, TablesInsert } from "../types/database.types";


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


export async function fetchRoomByCode(code: string) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('rooms').select('*').eq('code', code).single()
    if (error) {
        throw error
    } else {
        return data as Room
    }
}


export async function fetchRoomsCodes() {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('rooms').select('code')
    if (error) {
        throw error
    } else {
        const codesArray = data.map((e: {code: string}) => e.code)
        return codesArray
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
        throw error
    } else {
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
        throw error
    } else {
        const result = data as Room[]
        return result
    }
}


export interface roomParams {
    navigation: {
        type: 'pratico' | 'animateur' | 'libre'
        follow: string
    }
}

export async function saveRoomParams(roomId: number, params: roomParams) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('rooms').update(params).eq('id', roomId)
    if (error) {
        throw error
    } else {
        return data
    }
}