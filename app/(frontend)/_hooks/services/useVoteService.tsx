'use client'
import logger from '@/app/_utils/logger'
import { useState } from 'react'
import { saveRoomActivitySnapshot } from '@/app/(backend)/api/room/room.client'
import { useRoom } from '../contexts/useRoom'
import { useUser } from '../contexts/useUser'
import usePollParticipation from '../stores/usePollParticipationStore'
import { PollSnapshot } from '@/app/_types/poll2'


interface useVoteServiceReturn {
    vote: (choiceId: string) => void
    removeVote: (choiceId: string) => void
    isPending: boolean,
    error: string | null,
}

export function useVoteService(): useVoteServiceReturn {
    const { userId } = useUser()
    const { room } = useRoom()
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!userId) {
        logger.error('zustand:store', 'usePollParticipation.tsx', 'vote', 'Cant vote because no user id found')
        return { isPending: false, error: 'Cant vote because no user id found', vote: () => {}, removeVote: () => {} }
    }

    if (!room) {
        logger.error('zustand:store', 'usePollParticipation.tsx', 'vote', 'Cant vote because no room provided')
        return { isPending: false, error: 'Cant vote because no room provided', vote: () => {}, removeVote: () => {} }
    }

    // TODO: use useTransition here to make non-blocking UI
    const vote = async (choiceId: string) => {
        setIsPending(true)
        setError(null)

        // Optimistic update
        usePollParticipation.getState().vote({ choiceId, userId: userId! })

        // Save the vote in the database
        const newSnapshot: PollSnapshot = {
            type: 'poll',
            activityId: usePollParticipation.getState().pollId!,
            currentQuestionId: usePollParticipation.getState().currentQuestionId!,
            state: usePollParticipation.getState().state,
            answers: usePollParticipation.getState().answers
        }

        const { error } = await saveRoomActivitySnapshot(room.id, newSnapshot)

        setIsPending(false)

        if (error) {
            setError(error)
            // Rollback the optimistic update
            usePollParticipation.getState().removeVote({ choiceId, userId: userId! })
        }
    }

    const removeVote = async (choiceId: string) => {
        setIsPending(true)
        setError(null)

        // Optimistic update
        usePollParticipation.getState().removeVote({ choiceId, userId: userId! })

        // Save the new snapshot in the database
        const newSnapshot: PollSnapshot = {
            type: 'poll',
            activityId: usePollParticipation.getState().pollId!,
            currentQuestionId: usePollParticipation.getState().currentQuestionId!,
            state: usePollParticipation.getState().state,
            answers: usePollParticipation.getState().answers
        }

        const { error } = await saveRoomActivitySnapshot(room.id, newSnapshot)

        setIsPending(false)

        if (error) {
            setError(error)
            // Rollback the optimistic update
            usePollParticipation.getState().vote({ choiceId, userId: userId! })
        }
    }

    return { isPending, error, vote, removeVote }
}