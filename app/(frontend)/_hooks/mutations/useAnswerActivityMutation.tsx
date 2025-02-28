'use client'
import { PollUserAnswer } from "@/app/_types/poll"
import { QuizUserAnswer } from "@/app/_types/quiz"
import { PostgrestError } from "@supabase/supabase-js"
import { useState, useCallback, useMemo } from "react"
import createClient from "@/supabase/clients/client"
import { Json } from "@/supabase/types/database.types"
import logger from "@/app/_utils/logger"


type ReturnType = { error: PostgrestError | Error | null }

export default function useAnswerActivityMutation(): {
    addAnswer: (roomId: string, answer: PollUserAnswer | QuizUserAnswer) => Promise<ReturnType>
    removeAnswer: (roomId: string, answer: PollUserAnswer | QuizUserAnswer) => Promise<ReturnType>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const supabase = createClient()

    /**
     * Adds a user answer to an activity snapshot in the room table.
     * Calls an RPC Postgres function that has been created in the Supabase dashboard.
     * The function is deployed as a migration.
     * This solution has been chosen in order to prevent race conditions.
     */
    const addAnswer = useCallback(async (roomId: string, answer: PollUserAnswer | QuizUserAnswer) => {
        setIsPending(true)
        
        const roomIdToInt = parseInt(roomId)
        if (isNaN(roomIdToInt)) {
            logger.error('react:hook', 'useAnswerActivityMutation.tsx', 'Cannot call addAnswer() because : Invalid room id')
            return {error: new Error('Invalid room id')}
        }

        const { error } = await supabase.rpc('add_activity_answer', {
            room_id: roomIdToInt,
            answer: answer as unknown as Json
        })

        setIsPending(false)

        if (error) logger.error('react:hook', 'useAnswerActivityMutation.tsx', 'Error adding answer', error)

        return { error: error || null }
    }, [supabase])


    const removeAnswer = useCallback(async (roomId: string, answer: PollUserAnswer | QuizUserAnswer) => {
        setIsPending(true)
        
        const roomIdToInt = parseInt(roomId)
        if (isNaN(roomIdToInt)) {
            logger.error('react:hook', 'useAnswerActivityMutation.tsx', 'Cannot call removeAnswer() because : Invalid room id')
            return {error: new Error('Invalid room id')}
        }

        const { error } = await supabase.rpc('remove_activity_answer', {
            room_id: roomIdToInt,
            user_id: answer.userId,
            question_id: answer.questionId,
            choice_id: answer.choiceId
        })

        setIsPending(false)

        if (error) logger.error('react:hook', 'useAnswerActivityMutation.tsx', 'Error removing answer', error)
            
        return { error: error || null }
    }, [supabase])

    return { addAnswer, removeAnswer, isPending }
}