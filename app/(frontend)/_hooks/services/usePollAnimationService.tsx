import logger from "@/app/_utils/logger"
import { useEffect } from "react"
import { PollSnapshot, Poll, PollUserAnswer } from "@/domain/entities/activities/poll"
import usePollAnimationStore from "../stores/usePollAnimationStore"
import { useRoom } from "../contexts/useRoom"
import { useRealtimeActivityContext } from "../contexts/useRealtimeActivityContext"
import { useState, useCallback, useMemo } from "react"
import { useUser } from "../contexts/useUser"
import { useRoomMutation } from "../mutations/useRoomMutation"
import useAnswerActivityMutation from "../mutations/useAnswerActivityMutation"
import useRoomEventsMutation from "../mutations/useRoomEventsMutation"


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
    const { save, isSaving } = useSavePollSnapshot()
    const { userId } = useUser()
    const { room } = useRoom()
    const { addAnswer: addAnswerMutation, removeAnswer: removeAnswerMutation } = useAnswerActivityMutation()


    const addAnswer = useCallback(async (choiceId: string) => {
        if (!userId) return { error: 'No user id' }
        if (!room?.id) return { error: 'No room id' }

        const currentQuestionId = usePollAnimationStore.getState().currentQuestionId
        if (!currentQuestionId) return { error: 'No current question id' }

        const newAnswer: PollUserAnswer = {
            userId: userId,
            questionId: currentQuestionId, 
            choiceId: choiceId,
            timestamp: Date.now()
        }

        // Update the store immediately (optimistic update)
        usePollAnimationStore.getState().addAnswer(newAnswer)

        // Add the answer to the database
        const { error } = await addAnswerMutation(`${room.id}`, newAnswer)

        if (error) {
            logger.error('zustand:store', 'usePollAnimation.tsx', 'Error saving answer', error)
            return { error: error.message }
        }

        return { error: null }


    }, [userId, room, addAnswerMutation])

    const removeAnswer = useCallback(async (choiceId: string) => {
        if (!userId) {
            logger.error('zustand:store', 'usePollAnimationService.tsx', 'addAnswer', 'No user id')
            return { error: 'No user id' }
        }

        if (!room?.id) {
            logger.error('zustand:store', 'usePollAnimationService.tsx', 'addAnswer', 'No room id')
            return { error: 'No room id' }
        }

        const state = usePollAnimationStore.getState()

        if (!state.currentQuestionId) {
            logger.error('zustand:store', 'usePollAnimationService.tsx', 'addAnswer', 'No current question id')
            return { error: 'No current question id' }
        }

        const answerToRemove = state.answers.find(a =>
            a.userId === userId &&
            a.questionId === state.currentQuestionId &&
            a.choiceId === choiceId
        )

        if (!answerToRemove) {
            logger.error('zustand:store', 'usePollAnimationService.tsx', 'removeAnswer', 'Answer to remove not found with choice id', choiceId)
            return { error: 'No answer to remove' }
        }

        // Update the store immediately
        state.removeAnswer(answerToRemove)

        // Save the new state in the database
        const { error } = await removeAnswerMutation(`${room.id}`, answerToRemove)

        if (error) {
            logger.error('zustand:store', 'usePollAnimationService.tsx', 'removeAnswer', error)
            return { error: error.message }
        }

        return { error: null }

    }, [userId, room, removeAnswerMutation])

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

            // Set the state to 'answering' to avoid revealing the answer
            usePollAnimationStore.getState().setQuestionState('voting')

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

            // Set the state to 'answering' to avoid revealing the answer
            usePollAnimationStore.getState().setQuestionState('voting')

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
 * Close a poll activity.
 * This empties the store and removes the activity snapshot
 * from the database
 */
export function useClosePollService(): {
    closePoll: () => Promise<{error: string | null}>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const roomId = useRoom().room?.id
    const { saveActivitySnapshot } = useRoomMutation()
    const { addEndActivityEvent } = useRoomEventsMutation(`${roomId}`)

    return {
        closePoll: async () => {
            if (!roomId) return { error: 'No room id'}
            setIsPending(true)
            const previousState = usePollAnimationStore.getState()

            usePollAnimationStore.getState().closePoll()

            const { error } = await saveActivitySnapshot(`${roomId}`, null)
            setIsPending(false)

            if (error) usePollAnimationStore.setState(previousState) // Rollback

            if (!error) {
                addEndActivityEvent({
                    type: 'poll',
                    activityId: `${previousState.id}`,
                    answers: previousState.answers
                })
            }

            return { error: error?.message || null }
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
    //const { poll, snapshot, isSyncing, error } = useSyncPollService()
    const { activity, snapshot, isSyncing, error } = useRealtimeActivityContext()

    // Put the snapshot in the store
    useEffect(() => {
        if (snapshot && snapshot.type === 'poll') {
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
        if (activity && activity.type === 'poll') {
            usePollAnimationStore.getState().setPoll(activity as Poll)
        } else {
            usePollAnimationStore.getState().closePoll()
        }
    }, [activity])

    return { isSyncing, error }
}


// Utils

/**
 * Save the current state of the poll in the store, into the database.
 */
function useSavePollSnapshot() :{
    save: () => Promise<{ error: string | null }>
    isSaving: boolean
} {
    const [isSaving, setIsSaving] = useState(false)
    const roomId = useRoom().room?.id
    const { saveActivitySnapshot } = useRoomMutation()

    const save = useCallback(async () => {
        if (!roomId) return { error: 'No room id'}
        
        const state = usePollAnimationStore.getState()
        if (!state.id) return { error: 'No activity id'}
        if (!state.currentQuestionId) return { error: 'No current question id'}

        if (!state.id) {
            // Store is empty. It means we want to delete the snapshot
            setIsSaving(true)
            const { error } = await saveActivitySnapshot(`${roomId}`, null)
            setIsSaving(false)
            return { error: error?.message || null }
        }
        
        const snapshot: PollSnapshot = {
            type: 'poll',
            activityId: state.id,
            currentQuestionId: state.currentQuestionId,
            state: state.state,
            answers: state.answers
        }
        
        setIsSaving(true)
        const { error } = await saveActivitySnapshot(`${roomId}`, snapshot)
        setIsSaving(false)
        return { error: error?.message || null }
    }, [roomId, saveActivitySnapshot])

    return { save, isSaving }
}