import logger from "@/app/_utils/logger"
import { saveRoomActivitySnapshot } from "@/app/(backend)/api/room/room.client"
import { fetchActivity } from "@/app/(backend)/api/activity/activitiy.client"
import { useEffect } from "react"
import { PollSnapshot, Poll, PollUserAnswer } from "@/app/_types/poll"
import usePollAnimationStore from "../stores/usePollAnimationStore"
import { useRoom } from "../contexts/useRoom"
import useSyncPollService from "./useSyncPollService"
import { useState, useCallback, useMemo } from "react"
import { useUser } from "../contexts/useUser"


export function usePollAnimationService(): {
    addAnswer: (choiceId: string) => Promise<{ error: string | null }>
    removeAnswer: (choiceId: string) => Promise<{ error: string | null }>
    toggleAnswer: (choiceId: string) => Promise<{ error: string | null }>
    setCurrentQuestionId: (questionId: string) => Promise<{ error: string | null }>
    setCurrentQuestionIndex: (index: number) => Promise<{ error: string | null }>
    setQuestionState: (state: PollSnapshot['state']) => Promise<{ error: string | null }>
    myChoicesIds: string[]
    isSaving: boolean
} {
    const { save, isSaving } = useSaveRoomActivitySnapshot()
    const { userId } = useUser()

    const addAnswer = useCallback(async (choiceId: string) => {
        if (isSaving) return { error: 'Saving in progress '}
        if (!userId) return { error: 'No user id' }

        const currentQuestionId = usePollAnimationStore.getState().currentQuestionId
        if (!currentQuestionId) return { error: 'No current question id' }

        // Save the current answers in case of rollback
        const originalAnswers = usePollAnimationStore.getState().answers

        const newAnswer: PollUserAnswer = {
            userId: userId,
            questionId: currentQuestionId,
            choiceId: choiceId,
            timestamp: Date.now()
        }

        usePollAnimationStore.getState().addAnswer(newAnswer)

        const { error } = await save()

        if (error) {
            usePollAnimationStore.getState().setAnswers(originalAnswers)
            logger.error('zustand:store', 'usePollAnimation.tsx', 'Error saving answer', error)
        }
        return { error }
    }, [userId, save, isSaving])

    const removeAnswer = useCallback(async (choiceId: string) => {
        if (isSaving) return { error: 'Saving in progress' }
        if (!userId) return { error: 'No user id' }

        const currentQuestionId = usePollAnimationStore.getState().currentQuestionId
        if (!currentQuestionId) return { error: 'No current question id' }

        // Save the current answers in case of rollback
        const originalAnswers = usePollAnimationStore.getState().answers

        usePollAnimationStore.getState().removeAnswer({
            userId: userId,
            questionId: currentQuestionId,
            choiceId: choiceId
        })

        const { error } = await save()

        if (error) {
            usePollAnimationStore.getState().setAnswers(originalAnswers)
            logger.error('zustand:store', 'usePollAnimation.tsx', 'Error saving answer', error)
        }
        return { error }
    }, [save, isSaving, userId])

    const answers = usePollAnimationStore(state => state.answers)

    const myChoicesIds = useMemo(() =>
        answers.filter(a => a.userId === userId).map(a => a.choiceId),
        [answers, userId]
    )

    return {

        addAnswer: addAnswer,

        removeAnswer: removeAnswer,

        toggleAnswer: async (choiceId) => {
            if (myChoicesIds.includes(choiceId)) {
                return removeAnswer(choiceId)
            } else {
                return addAnswer(choiceId)
            }
        },

        setCurrentQuestionId: async (questionId) => {
            if (isSaving) return { error: 'Saving in progress' }

            const previousQuestionId = usePollAnimationStore.getState().currentQuestionId    

            usePollAnimationStore.getState().setQuestionId(questionId)

            const { error } = await save()
            if (error && previousQuestionId) {
                // Rollback (if previous value exist)
                usePollAnimationStore.getState().setQuestionId(previousQuestionId)
            }

            return { error }
        },

        setCurrentQuestionIndex: async (index) => {
            if (isSaving) return { error: 'Saving in progress' }

            const id = usePollAnimationStore.getState().poll?.questions[index].id
            if (!id) return { error: 'No question id' }

            const previousQuestionId = usePollAnimationStore.getState().currentQuestionId

            usePollAnimationStore.getState().setQuestionId(id)

            const { error } = await save()
            if (error && previousQuestionId) {
                // Rollback (if previous value exist)
                usePollAnimationStore.getState().setQuestionId(previousQuestionId)
            }

            return { error }
        },

        setQuestionState: async (state) => {
            if (isSaving) return { error: 'Saving in progress' }

            const previousState = usePollAnimationStore.getState().state

            usePollAnimationStore.getState().setQuestionState(state)

            const { error } = await save()
            if (error && previousState) {
                // Rollback (if previous value exist)
                usePollAnimationStore.getState().setQuestionState(previousState)
            }

            return { error }
        },

        myChoicesIds: myChoicesIds,

        isSaving: isSaving,
    }
}




/**
 * Open a poll in the store given its id.
 * This function fetches the activity from the database.
 */
export function useStartPollService(): {
    startPoll: (activityId: number | string) => Promise<{ error: string | null }>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const roomId = useRoom().room?.id

    const startPoll = async (activityId: number | string) => {
        if (!roomId) {
            logger.error('supabase:database', 'StartButton', 'Cannot start activity outside of a room')
            return { error: 'No room id' }
        }
        setIsPending(true)

        const id = parseInt(activityId as string)

        const { data, error } = await fetchActivity(id)

        if (error || !data) {
            logger.error('zustand:store', 'usePollAnimation', 'Error fetching activity', error)
            setIsPending(false)
            return { error: 'Error fetching activity' }
        }

        if (!(data.type == 'poll')) {
            logger.error('zustand:store', 'usePollAnimation', 'Activity is not a poll')
            setIsPending(false)
            return { error: 'Activity is not a poll' }
        }

        const poll = data.object as Poll

        // Update the store
        usePollAnimationStore.getState().setPoll(poll)
        usePollAnimationStore.getState().setPollId(id)
        usePollAnimationStore.getState().setQuestionId(poll.questions[0].id)

        // Save in the database
        const snapshot: PollSnapshot = {
            type: 'poll',
            activityId: id,
            currentQuestionId: poll.questions[0].id,
            state: 'voting',
            answers: []
        }

        const { error: snapshotError } = await saveRoomActivitySnapshot(roomId, snapshot)
        setIsPending(false)

        return { error: snapshotError }
    }

    return { startPoll, isPending }
}


/**
 * Close a poll activity.
 * This empties the store and remove the activity snapshot
 * from the database
 */
export function useClosePollService(): {
    closePoll: () => Promise<{error: string | null}>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const roomId = useRoom().room?.id

    return {
        closePoll: async () => {
            if (!roomId) return { error: 'No room id'}
            setIsPending(true)
            const previousState = usePollAnimationStore.getState()

            usePollAnimationStore.getState().closePoll()

            const { error } = await saveRoomActivitySnapshot(roomId, null)
            setIsPending(false)

            if (error) usePollAnimationStore.setState(previousState) // Rollback

            return { error }
        },

        isPending: isPending
    }
}

/**
 * Listen to the changes in the database and
 * automatically update the store
 */
export function useSyncAnimationPollService(): {
    isSyncing: boolean
    error: string | null
} {
    // Sync remote poll data into the store
    const { poll, snapshot, isSyncing, error } = useSyncPollService()

    // Put the snapshot in the store
    useEffect(() => {
        if (snapshot) {
            usePollAnimationStore.getState().setPollId(snapshot.activityId)
            usePollAnimationStore.getState().setQuestionId(snapshot.currentQuestionId)
            usePollAnimationStore.getState().setQuestionState(snapshot.state)
            usePollAnimationStore.getState().setAnswers(snapshot.answers)
        } else {
            usePollAnimationStore.getState().closePoll()
        }
    }, [snapshot])

    // Put the poll in the store
    useEffect(() => {
        if (poll) {
            usePollAnimationStore.getState().setPoll(poll)
        } else {
            usePollAnimationStore.getState().closePoll()
        }
    }, [poll])

    return { isSyncing, error }
}


// Utils

/**
 * Save the current state of the poll in the store, into the database.
 */
function useSaveRoomActivitySnapshot() :{
    save: () => Promise<{ error: string | null }>
    isSaving: boolean
} {
    const [isSaving, setIsSaving] = useState(false)
    const roomId = useRoom().room?.id

    const save = useCallback(async () => {
        if (!roomId) return { error: 'No room id'}
        setIsSaving(true)
        const state = usePollAnimationStore.getState()
        const snapshot = {
            type: 'poll',
            activityId: state.id,
            currentQuestionId: state.currentQuestionId,
            state: state.state,
            answers: state.answers
        } as PollSnapshot

        const { error } = await saveRoomActivitySnapshot(roomId, snapshot)
        setIsSaving(false)
        return { error }
    }, [roomId])

    return { save, isSaving }
}