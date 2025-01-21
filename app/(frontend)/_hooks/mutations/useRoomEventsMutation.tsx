'use client'
import { RoomEvent } from "@/app/_types/room-events"
import { useCallback, useState } from "react"
import createClient from "@/supabase/clients/client"
import { TablesInsert } from "@/supabase/types/database.types"
import { PostgrestError } from "@supabase/supabase-js"


export default function useRoomEventsMutation(): {
    addRoomEvent: (roomEvent: RoomEvent) => Promise<{ error: PostgrestError | null }>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const supabase = createClient()

    const addRoomEvent = useCallback(async (roomEvent: RoomEvent) => {
        setIsPending(true)

        const newRoomEvent: TablesInsert<'room_events'> = {
            type: roomEvent.type,
            payload: roomEvent.payload,
            room_id: parseInt(roomEvent.room_id)
        }

        const { error } = await supabase.from('room_events').insert(newRoomEvent)

        setIsPending(false)
        return { error }
    }, [supabase])


    return {
        addRoomEvent: addRoomEvent,
        isPending: isPending
    }
}