'use client'
import { useEffect, useCallback, useMemo } from 'react'
import { useRealtimeActivityContext } from '../contexts/useRealtimeActivityContext'
import usePollParticipationStore from '../stores/usePollParticipationStore'
import { useUser } from '../contexts/useUser'
import { useRoom } from '../contexts/useRoom'
import useAnswerActivityMutation from '../mutations/useAnswerActivityMutation'
import { isEqual, debounce } from 'lodash'


export default function usePollParticipationService(): {
    toggleVote: (choiceId: string) => Promise<{ error: string | null }>
    myChoicesIds: string[]
    isPending: boolean
} {
    const { userId } = useUser()
    const roomId = useRoom().room?.id
    const { addAnswer, removeAnswer, isPending } = useAnswerActivityMutation()
    const answers = usePollParticipationStore(state => state.answers)
    const currentQuestionId = usePollParticipationStore(state => state.currentQuestionId)
    const pollId = usePollParticipationStore(state => state.pollId)
    const removeVote = usePollParticipationStore(state => state.removeVote)
    const vote = usePollParticipationStore(state => state.vote)


   const toggleVote = useCallback(async (choiceId: string) => {
        if (!userId) return { error: 'No user id' }
        if (!roomId) return { error: 'No room id' }

        if (!currentQuestionId) return { error: 'No current question id' }
        if (!pollId) return { error: 'No poll id' }

        // Check if the user has already voted this choice
        const hasVoted = answers.some(a => a.userId === userId && a.choiceId === choiceId)

        if (hasVoted) {
            removeVote({ choiceId, userId })

            const { error } = await removeAnswer(`${roomId}`, {
                userId,
                choiceId,
                timestamp: new Date().getTime(), // We actually don't need this
                questionId: currentQuestionId
            })

            if (error) return { error: error.message }


        } else {
            vote({ choiceId, userId })

            const { error } = await addAnswer(`${roomId}`, {
                userId,
                choiceId,
                timestamp: new Date().getTime(),
                questionId: currentQuestionId
            })

            if (error) return { error: error.message }
        }

        return { error: null }
    }, [userId, roomId, addAnswer, removeAnswer, currentQuestionId, pollId, answers, removeVote, vote])

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
    const { activity, snapshot, isSyncing, error } = useRealtimeActivityContext()
    //const { userId } = useUser()
    const setSnapshot = usePollParticipationStore(state => state.setSnapshot)
    const setPoll = usePollParticipationStore(state => state.setPoll)

    // Create debounced store update functions
    const debouncedSetSnapshot = useMemo(
        () => debounce((snapshot: any) => {
            setSnapshot(snapshot)
        }, 500),
        [setSnapshot]
    )

    const debouncedSetPoll = useMemo(
        () => debounce((activity: any) => {
            setPoll(activity)
        }, 500),
        [setPoll]
    )

    // Put the snapshot in the store
    useEffect(() => {
        if (snapshot?.type !== 'poll') {
            // Clear the store
            debouncedSetSnapshot(null)
            return
        }
        debouncedSetSnapshot(snapshot)

        // Cleanup
        return () => {
            debouncedSetSnapshot.cancel()
        }
    }, [snapshot, debouncedSetSnapshot])

    // Put the poll in the store
    useEffect(() => {
        if (!activity || activity.type !== 'poll') {
            // Clear
            debouncedSetPoll(null)
            return
        }
        debouncedSetPoll(activity)

        // Cleanup
        return () => {
            debouncedSetPoll.cancel()
        }
    }, [activity, debouncedSetPoll])

    return { isSyncing, error }
}