'use server'
import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { cache } from "react"
import { TablesInsert, Tables, Json } from "@/supabase/types/database.types"


/**
 * Every event should have a `type` and a `schemaVersion` field.
 */
interface BaseEvent {
    type: string

    /**
     * The shape of the event payloads may change over time.
     * The Supabase table will then contain events with different schemas.
     * The `schemaVersion` field will allow us to know how to interpret the payload.
     */
    schemaVersion: string
}

export interface RoomStartEvent extends BaseEvent {
    type: 'start room'
    schemaVersion: '1'
    started_by: string
}

export interface RoomStopEvent extends BaseEvent {
    type: 'stop room'
    schemaVersion: '1'
    stopped_by: string
}

export interface ActivityStartEvent extends BaseEvent {
    type: 'start activity'
    schemaVersion: '1'
    started_by: string
    activity_id: number
}

export interface ActivityStopEvent extends BaseEvent {
    type: 'stop activity'
    schemaVersion: '1'
    stopped_by: string
    activity_id: number
}

type Event = RoomStartEvent | RoomStopEvent | ActivityStartEvent | ActivityStopEvent


export async function sendRoomEvent({ room_id, event }: { room_id: number, event: Event }) {
    const supabase = createClient()

    // Let's destructure the object as `type` and `payload` are separate columns in the table
    const { type, ...payload } = event

    const newRow: TablesInsert<'room_events'> = {room_id, type, payload}

    const { error } = await supabase.from('room_events').insert(newRow)

    if (error) logger.error('supabase:database', 'Error sending room event', error)
    return { error: error?.message }
}