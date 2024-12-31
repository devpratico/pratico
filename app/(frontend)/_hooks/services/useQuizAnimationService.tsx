'use client'
import { QuizSnapshot } from "@/app/_types/quiz2"
import { useState, useCallback } from "react"
import { useRoom } from "../contexts/useRoom"
import useQuizAnimationStore from "../stores/useQuizAnimationStore"
import { saveRoomActivitySnapshot } from "@/app/(backend)/api/room/room.client"
import { useUser } from "../contexts/useUser"


type AsyncOperationResult = Promise<{ error: string | null }>


export function useQuizAnimationService(): {
    toggleAnswer: (choiceId: string) => AsyncOperationResult
    setCurrentQuestionIndex: (index: number) => AsyncOperationResult
    setQuestionState: (state: QuizSnapshot['state']) => AsyncOperationResult
    isPending: boolean
} {
    const { save, isSaving } = useSaveRoomActivitySnapshot()
    const { userId } = useUser()

    const addAnswer = useCallback(async (choiceId: string) => {
        if (isSaving) return { error: 'Saving in progress' }
        if (!userId) return { error: 'No user id' }

        const state = useQuizAnimationStore.getState()

        if (!state.currentQuestionId) return { error: 'No current question id' }

        // Check if the user has already answered this question

    }, [])

    return {
        toggleAnswer: async () => ({ error: null }),
        setCurrentQuestionIndex: async () => ({ error: null }),
        setQuestionState: async () => ({ error: null }),
        isPending: false
    }
}




// Utils

/**
 * Save the current state of the quiz in the store, into the database.
 */
function useSaveRoomActivitySnapshot(): {
    save: () => AsyncOperationResult
    isSaving: boolean
} {
    const [isSaving, setIsSaving] = useState(false)
    const roomId = useRoom().room?.id

    const save = useCallback(async () => {
        if (!roomId) return { error: 'No room id' }

        const state = useQuizAnimationStore.getState()
        if (!state.activityId) return { error: 'No activity id' }
        if (!state.currentQuestionId) return { error: 'No current question id' }

        const snapshot: QuizSnapshot = {
            type: 'quiz',
            activityId: state.activityId,
            currentQuestionId: state.currentQuestionId,
            state: state.state,
            answers: state.answers
        }
        
        setIsSaving(true)
        const { error } = await saveRoomActivitySnapshot(roomId, snapshot)
        setIsSaving(false)
        return { error }
    }, [roomId])

    return { save, isSaving }
}