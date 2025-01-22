'use client'
import { useCallback, useState } from "react"
import createClient from "@/supabase/clients/client"
import { TablesInsert } from "@/supabase/types/database.types"
import { PostgrestError } from "@supabase/supabase-js"
import { PollUserAnswer } from "@/app/_types/poll"
import { QuizUserAnswer } from "@/app/_types/quiz"
import { Json } from "@/supabase/types/database.types"


type AddRoomEventArgs = {
    type: 'start poll'
    payload: {pollId: string}
    room_id: string
} | {
    type: 'end poll'
    payload: {startEventId: string, answers: PollUserAnswer[]}
    room_id: string
} | {
    type: 'start quiz'
    payload: {quizId: string}
    room_id: string
} | {
    type: 'end quiz'
    payload: {startEventId: string, answers: QuizUserAnswer[]}
    room_id: string
}


export default function useRoomEventsMutation(): {
    addRoomEvent: (args: AddRoomEventArgs) => Promise<{ error: PostgrestError | null }>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const supabase = createClient()

    const addRoomEvent = useCallback(async (args: AddRoomEventArgs) => {
        setIsPending(true)

        const newRoomEvent: TablesInsert<'room_events'> = {
            type: args.type,
            payload: args.payload as Json,
            room_id: parseInt(args.room_id)
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