'use client'
import { useEffect, useCallback, useMemo } from 'react'
import { useRealtimeActivityContext } from '../contexts/useRealtimeActivityContext'
import usePollParticipationStore from '../stores/usePollParticipationStore'
import { useUser } from '../contexts/useUser'
import { useRoom } from '../contexts/useRoom'
import useAnswerActivityMutation from '../mutations/useAnswerActivityMutation'


export default function usePollParticipationService(): {
    toggleVote: (choiceId: string) => Promise<{ error: string | null }>
    myChoicesIds: string[]
    isPending: boolean
} {
    const { userId } = useUser()
    const roomId = useRoom().room?.id
    const answers = usePollParticipationStore(state => state.answers)
    const { addAnswer, removeAnswer, isPending } = useAnswerActivityMutation()

   const toggleVote = useCallback(async (choiceId: string) => {
        if (!userId) return { error: 'No user id' }
        if (!roomId) return { error: 'No room id' }

        const initialState = usePollParticipationStore.getState()
        if (!initialState.currentQuestionId) return { error: 'No current question' }
        if (!initialState.pollId) return { error: 'No poll id' }

        // Check if the user has already voted this choice
        const hasVoted = initialState.answers.some(a => a.userId === userId && a.choiceId === choiceId)

        if (hasVoted) {
            usePollParticipationStore.getState().removeVote({ choiceId, userId })

            const { error } = await removeAnswer(`${roomId}`, {
                userId,
                choiceId,
                timestamp: new Date().getTime(), // We actually don't need this
                questionId: initialState.currentQuestionId
            })

            if (error) return { error: error.message }


        } else {
            usePollParticipationStore.getState().vote({ choiceId, userId })

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

    return { toggleVote, myChoicesIds, isPending }
}



/**
 * Listen to the changes in the database and
 * automatically update the store
 */
export function useSyncParticipationPollService(): {
    isSyncing: boolean
    error: string | null
} {
    // Sync remote poll data into the store
    const { activity, snapshot, isSyncing, error } = useRealtimeActivityContext()
    const { userId } = useUser()

    // Put the snapshot in the store
    useEffect(() => {
        if (snapshot?.type !== 'poll') {
            // Clear the store
            usePollParticipationStore.getState().setSnapshot(null)
            return
        }
        usePollParticipationStore.getState().setSnapshot(snapshot)
    }, [snapshot, userId])

    // Put the poll in the store
    useEffect(() => {
        if (!activity || activity.type !== 'poll') {
            // Clear
            usePollParticipationStore.getState().setPoll(null)
            return
        }
        usePollParticipationStore.getState().setPoll(activity)
    }, [activity])

    return { isSyncing, error }
}