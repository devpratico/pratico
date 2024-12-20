'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import useSyncPollService from './useSyncPollService'
import usePollParticipationStore from '../stores/usePollParticipationStore'
import { PollSnapshot } from '@/app/_types/poll2'
import { useUser } from '../contexts/useUser'
import { saveRoomActivitySnapshot } from '@/app/(backend)/api/room/room.client'
import { useRoom } from '../contexts/useRoom'


export default function usePollParticipationService(): {
    toggleVote: (choiceId: string) => Promise<{ error: string | null }>
    myChoicesIds: string[]
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const { userId } = useUser()
    const roomId = useRoom().room?.id
    const answers = usePollParticipationStore(state => state.answers)

   const toggleVote = useCallback(async (choiceId: string) => {
        if (!userId) return { error: 'No user id' }
        if (!roomId) return { error: 'No room id' }

        const initialState = usePollParticipationStore.getState()
        if (!initialState.currentQuestionId) return { error: 'No current question' }

        // Save this for later in case we need to rollback
        const initialSnapshot: PollSnapshot = {
            type: 'poll',
            activityId: roomId,
            currentQuestionId: initialState.currentQuestionId,
            state: 'voting',
            answers: initialState.answers
        }

        setIsPending(true)

        // Check if the user has already voted this choice
        const hasVoted = initialState.answers.some(a => a.userId === userId && a.choiceId === choiceId)

        if (hasVoted) {
            usePollParticipationStore.getState().removeVote({ choiceId, userId })
        } else {
            usePollParticipationStore.getState().vote({ choiceId, userId })
        }

        // Save the snapshot to the database
        const snapshot: PollSnapshot = {
            type: 'poll',
            activityId: roomId,
            currentQuestionId: initialState.currentQuestionId,
            state: 'voting',
            answers: usePollParticipationStore.getState().answers
        }

        const { error } = await saveRoomActivitySnapshot(roomId, snapshot)
        if (error) {
            // Rollback the vote
            usePollParticipationStore.getState().setSnapshot(initialSnapshot)
            setIsPending(false)
            return { error }
        }

        setIsPending(false)
        return { error: null }
    }, [userId, roomId])

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
    const { poll, snapshot, isSyncing, error } = useSyncPollService()
    const { userId } = useUser()

    // Put the snapshot in the store
    useEffect(() => {
        usePollParticipationStore.getState().setSnapshot(snapshot)
    }, [snapshot, userId])

    // Put the poll in the store
    useEffect(() => {
        usePollParticipationStore.getState().setPoll(poll)
    }, [poll])

    return { isSyncing, error }
}