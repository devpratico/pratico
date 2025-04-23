'use client'
import { useCallback, useState } from "react"
import createClient from "@/supabase/clients/client"
import { TablesInsert } from "@/supabase/types/database.types"
import { PostgrestError } from "@supabase/supabase-js"
import { PollUserAnswer } from "@/app/_types/poll"
import { QuizUserAnswer } from "@/app/_types/quiz"
import { Json } from "@/supabase/types/database.types"
import logger from "@/app/_utils/logger"


type AddRoomEventArgs = {
    type: 'start poll' | 'start quiz'
    payload: {activityId: string}
} | {
    type: 'end poll'
    payload: {startEventId: string, answers: PollUserAnswer[]}
} | {
    type: 'end quiz'
    payload: {startEventId: string, answers: QuizUserAnswer[]}
}


type AddStartActivityEventSignature = (
    activityId: string,
    type: 'quiz' | 'poll'
) => 
    Promise<{ error: PostgrestError | null }>


type AddEndActivityEventSignature = (args: {
    type: 'poll'
    activityId: string
    answers: PollUserAnswer[]
} | {
    type: 'quiz'
    activityId: string
    answers: QuizUserAnswer[]
}) =>
    Promise<{ error: PostgrestError | null }>


export default function useRoomEventsMutation(roomId: string): {
    addStartActivityEvent: AddStartActivityEventSignature
    addEndActivityEvent: AddEndActivityEventSignature
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const supabase = createClient()

    /**  Agnostic function to add a room event */
    const addRoomEvent = useCallback(async (args: AddRoomEventArgs) => {
        setIsPending(true)

        const newRoomEvent: TablesInsert<'room_events'> = {
            type: args.type,
            payload: args.payload as Json,
            room_id: parseInt(roomId)
        }

        const { error } = await supabase.from('room_events').insert(newRoomEvent) //.select().single()
        setIsPending(false)
        logger.log('react:hook', 'useRoomEventsMutation', 'addRoomEvent', 'Added room event', newRoomEvent, error && `error: ${error}`)
       return { error }
    }, [supabase, roomId])


    const addStartActivityEvent: AddStartActivityEventSignature = useCallback(async (activityId, type) => {
        const eventType = type=='poll' ? 'start poll' : 'start quiz'
        return await addRoomEvent({
            type: eventType,
            payload: { activityId }
        })
    }, [addRoomEvent])



    const addEndActivityEvent: AddEndActivityEventSignature = useCallback(async (args) => {
        // We need to find the start event id
        // Fetch the most recent event of type 'start quiz' with the same activityId, in the same room

        setIsPending(true)
        const { data, error } = await supabase
            .from('room_events')
            .select('id')
            .eq('room_id', parseInt(roomId))
            .eq('type', 'start ' + args.type)
            .eq('payload->>activityId', args.activityId)
            .order('timestamp', { ascending: false })
            .limit(1)

        setIsPending(false)

        if (error || data.length === 0) {
            logger.error(
                'supabase:database',
                'useRoomEventsMutation.tsx',
                `addEndActivityEvent(${JSON.stringify(args)})`,
                'Error fetching start event',
                error || 'No data found'
            )
            return { error }
        }

        const latestEvent = data[0]

        logger.log('react:hook', 'useRoomEventsMutation.tsx', 'addEndActivityEvent', 'Found corresponding start event', data)

        const startEventId = latestEvent.id.toString()

        const eventType = args.type === 'poll' ? 'end poll' : 'end quiz'

        return await addRoomEvent({
            type: eventType,
            payload: { startEventId, answers: args.answers }
        })

    }, [addRoomEvent, roomId, supabase])

    return {
        addStartActivityEvent: addStartActivityEvent,
        addEndActivityEvent: addEndActivityEvent,
        isPending: isPending
    }
}