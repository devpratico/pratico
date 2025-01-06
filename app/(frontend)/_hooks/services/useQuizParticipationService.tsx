'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRealtimeActivityContext } from '../contexts/useRealtimeActivityContext'
import useQuizParticipationStore from '../stores/useQuizParticipationStore'
import { QuizSnapshot } from '@/app/_types/quiz'
import { useUser } from '../contexts/useUser'
import { saveActivitySnapshot } from '@/app/(backend)/api/room/room.client'
import { useRoom } from '../contexts/useRoom'

export default function useQuizParticipationService(): {
    toggleAnswer: (choiceId: string) => Promise<{ error: string | null }>
    myChoicesIds: string[]
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const { userId } = useUser()
    const roomId = useRoom().room?.id
    const answers = useQuizParticipationStore(state => state.answers)

    const toggleAnswer = useCallback(async (choiceId: string) => {
        if (!userId) return { error: 'No user id' }
        if (!roomId) return { error: 'No room id' }

        const initialState = useQuizParticipationStore.getState()
        if (!initialState.currentQuestionId) return { error: 'No current question' }

        // Save this for later in case we need to rollback
        const initialSnapshot: QuizSnapshot = {
            type: 'quiz',
            activityId: roomId,
            currentQuestionId: initialState.currentQuestionId,
            state: 'answering',
            answers: initialState.answers
        }

        setIsPending(true)

        // Check if the user has already answered this choice
        const hasAnswered = initialState.answers.some(a => a.userId === userId && a.choiceId === choiceId)

        if (hasAnswered) {
            useQuizParticipationStore.getState().removeAnswer({ choiceId, userId })
        } else {
            useQuizParticipationStore.getState().answer({ choiceId, userId })
        }

        // Save the snapshot to the database
        const snapshot: QuizSnapshot = {
            type: 'quiz',
            activityId: roomId,
            currentQuestionId: initialState.currentQuestionId,
            state: 'answering',
            answers: useQuizParticipationStore.getState().answers
        }

        const { error } = await saveActivitySnapshot(roomId, snapshot)
        if (error) {
            // Rollback the answer
            useQuizParticipationStore.getState().setSnapshot(initialSnapshot)
            setIsPending(false)
            return { error }
        }

        setIsPending(false)
        return { error: null }
    }, [userId, roomId])

    const myChoicesIds = useMemo(() =>
        answers.filter(a => a.userId === userId).map(a => a.choiceId)
    , [userId, answers])

    return { toggleAnswer, myChoicesIds, isPending }
}

/**
 * Listen to the changes in the database and
 * automatically update the store
 */
export function useSyncParticipationQuizService(): {
    isSyncing: boolean
    error: string | null
} {
    // Sync remote quiz data into the store
    const { activity, snapshot, isSyncing, error } = useRealtimeActivityContext()
    const { userId } = useUser()

    // Put the snapshot in the store
    useEffect(() => {
        if (snapshot?.type !== 'quiz') {
            useQuizParticipationStore.getState().setSnapshot(null)
            return
        }
        useQuizParticipationStore.getState().setSnapshot(snapshot)
    }, [snapshot, userId])

    // Put the quiz in the store
    useEffect(() => {
        if (!activity || activity.type !== 'quiz') {
            useQuizParticipationStore.getState().setQuiz(null)
            return
        }
        useQuizParticipationStore.getState().setQuiz(activity)
    }, [activity])

    return { isSyncing, error }
}
