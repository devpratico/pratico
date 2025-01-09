'use client'
import { useEffect, useCallback, useMemo } from 'react'
import { useRealtimeActivityContext } from '../contexts/useRealtimeActivityContext'
import useQuizParticipationStore from '../stores/useQuizParticipationStore'
import { useUser } from '../contexts/useUser'
import { useRoom } from '../contexts/useRoom'
import useAnswerActivityMutation from '../mutations/useAnswerActivityMutation'

export default function useQuizParticipationService(): {
    toggleAnswer: (choiceId: string) => Promise<{ error: string | null }>
    myChoicesIds: string[]
    isPending: boolean
} {
    const { userId } = useUser()
    const roomId = useRoom().room?.id
    const answers = useQuizParticipationStore(state => state.answers)
    const { addAnswer, removeAnswer, isPending } = useAnswerActivityMutation()

    const toggleAnswer = useCallback(async (choiceId: string) => {
        if (!userId) return { error: 'No user id' }
        if (!roomId) return { error: 'No room id' }

        const initialState = useQuizParticipationStore.getState()
        if (!initialState.currentQuestionId) return { error: 'No current question' }
        if (!initialState.quizId) return { error: 'No quiz id' }

        // Check if the user has already answered this choice
        const hasAnswered = initialState.answers.some(a => a.userId === userId && a.choiceId === choiceId)

        if (hasAnswered) {
            useQuizParticipationStore.getState().removeAnswer({ choiceId, userId })

            const { error } = await removeAnswer(`${roomId}`, {
                userId,
                choiceId,
                timestamp: new Date().getTime(), // We actually don't need this
                questionId: initialState.currentQuestionId
            })

            if (error) return { error: error.message }

        } else {
            useQuizParticipationStore.getState().answer({ choiceId, userId })

            const { error } = await addAnswer(`${roomId}`, {
                userId,
                choiceId,
                timestamp: new Date().getTime(),
                questionId: initialState.currentQuestionId
            })

            if (error) return { error: error.message }
        }


        return { error: null }
    }, [userId, roomId, addAnswer, removeAnswer])

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
