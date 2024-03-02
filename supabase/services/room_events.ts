import getSupabaseClient from "../clients/getSupabaseClient";
import { TablesInsert } from "../types/database.types";
import logger from "@/utils/logger"


/**
 * Set an event in the `room_events` table
 */
export async function setRoomEvent(event: TablesInsert<'room_events'>) {
    const supabase =  await getSupabaseClient()
    const { data, error } = await supabase.from('room_events').insert(event)
    if (error) {
        //console.error("error setting room event", error)
        throw error
    } else {
        //logger.log('supabase:database', 'set room event', { data })
        return data
    }
}