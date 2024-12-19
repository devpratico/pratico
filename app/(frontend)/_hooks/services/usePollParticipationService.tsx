'use client'
import { useState, useEffect } from 'react'
import useSyncPollService from './useSyncPollService'
import usePollParticipationStore from '../stores/usePollParticipationStore'
import { PollSnapshot } from '@/app/_types/poll2'
import { useUser } from '../contexts/useUser'



export default function usePollParticipationService(): {
    toggleVote: (choiceId: string) => Promise<{ error: string | null }>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)

    async function toggleVote(choiceId: string) {
        setIsPending(true)

        // Do something

        setIsPending(false)
        return { error: null }
    }

    return { toggleVote, isPending }
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
        if (!snapshot) {
            usePollParticipationStore.getState().setSnapshot(null)
            return
        }

        // Remove all the answers that are not this user's answers
        const _snapshot: PollSnapshot = {
            ...snapshot,
            answers: snapshot?.answers.filter(a => a.userId === userId) || []
        }
        usePollParticipationStore.getState().setSnapshot(_snapshot)
    }, [snapshot, userId])

    // Put the poll in the store
    useEffect(() => {
        usePollParticipationStore.getState().setPoll(poll)
    }, [poll])

    return { isSyncing, error }
}