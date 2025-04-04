'use client'
import { QuizSnapshot, QuizUserAnswer, Quiz } from "@/app/_types/quiz"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useRoom } from "../contexts/useRoom"
import useQuizAnimationStore from "../stores/useQuizAnimationStore"
import { saveActivitySnapshot } from "@/app/(backend)/api/room/room.client"
import { useUser } from "../contexts/useUser"
import logger from "@/app/_utils/logger"
import { useRealtimeActivityContext } from "../contexts/useRealtimeActivityContext"
import useAnswerActivityMutation from "../mutations/useAnswerActivityMutation"
import useRoomEventsMutation from "../mutations/useRoomEventsMutation"


type AsyncOperationResult = { error: string | null }


export function useQuizAnimationService(): {
    toggleAnswer: (choiceId: string) => Promise<AsyncOperationResult>
    setCurrentQuestionIndex: (index: number) => Promise<AsyncOperationResult>
    setQuestionState: (state: QuizSnapshot['state']) => Promise<AsyncOperationResult>
    isPending: boolean
    myChoicesIds: string[]
} {
    const { userId } = useUser()
    const { room } = useRoom()
    const { save, isSaving } = useSaveQuizSnapshot()
    const { addAnswer: addAnswerMutation, removeAnswer: removeAnswerMutation } = useAnswerActivityMutation()

    const addAnswer = useCallback(async (choiceId: string): Promise<AsyncOperationResult> => {
        if (!userId) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'No user id')
            return { error: 'No user id' }
        }

        if (!room?.id) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'No room id')
            return { error: 'No room id' }
        }

        const state = useQuizAnimationStore.getState()

        if (!state.currentQuestionId) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'No current question id')
            return { error: 'No current question id' }
        }

        const newAnswer: QuizUserAnswer = {
            userId,
            choiceId,
            questionId: state.currentQuestionId,
            timestamp: new Date().getTime()
        }

        // Update the store immediately
        state.addAnswer(newAnswer)

        // Save the new state in the database
        const { error } = await addAnswerMutation(`${room.id}`, newAnswer)

        if (error) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', error)
            return { error: error.message }
        }


        return { error: null }

    }, [userId, room, addAnswerMutation])

    const removeAnswer = useCallback(async (choiceId: string): Promise<AsyncOperationResult> => {
        if (!userId) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'No user id')
            return { error: 'No user id' }
        }

        if (!room?.id) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'No room id')
            return { error: 'No room id' }
        }

        const state = useQuizAnimationStore.getState()

        if (!state.currentQuestionId) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'No current question id')
            return { error: 'No current question id' }
        }

        const answerToRemove = state.answers.find(a =>
            a.userId === userId &&
            a.questionId === state.currentQuestionId &&
            a.choiceId === choiceId
        )

        if (!answerToRemove) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'removeAnswer', 'Answer to remove not found with choice id', choiceId)
            return { error: 'No answer to remove' }
        }

        // Update the store immediately
        state.removeAnswer(answerToRemove)

        // Save the new state in the database
        const { error } = await removeAnswerMutation(`${room.id}`, answerToRemove)

        if (error) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'removeAnswer', error)
            return { error: error.message }
        }

        return { error: null }

    }, [userId, room, removeAnswerMutation])

    const toggleAnswer = useCallback(async (choiceId: string) => {
        const state = useQuizAnimationStore.getState()
        const hasAnswered = state.answers.some(answer =>
            answer.userId === userId &&
            answer.questionId === state.currentQuestionId &&
            answer.choiceId === choiceId
        )
        if (hasAnswered) {
            return removeAnswer(choiceId)
        } else {
            return addAnswer(choiceId)
        }
    }, [userId, addAnswer, removeAnswer])

    const setCurrentQuestionIndex = useCallback(async (index: number) => {
        const state = useQuizAnimationStore.getState()
        const questionId = state.quiz?.questions[index]?.id
        if (!questionId) return { error: 'No question id' }

        // Save the current question id in case of rollback
        const previousQuestionId = state.currentQuestionId
        if (!previousQuestionId) return { error: 'No previous question id' }
        if (previousQuestionId === questionId) return { error: 'Same question id' }



        // Set the state to 'answering' to avoid revealing the answer
        state.setQuestionState('answering')

        state.setQuestionId(questionId)

        // Save the new state in the database
        const { error } = await save()
        if (error) {
            // Rollback the store if the save failed
            state.setQuestionId(previousQuestionId)
            return { error }
        }

        return { error: null }
    }, [save])

    const setQuestionState = useCallback(async (state: QuizSnapshot['state']) => {
        const store = useQuizAnimationStore.getState()

        // Save the current state in case of rollback
        const previousState = store.state
        if (previousState === state) return { error: 'Same state' }

        store.setQuestionState(state)

        // Save the new state in the database
        const { error } = await save()
        if (error) {
            // Rollback the store if the save failed
            store.setQuestionState(previousState)
            return { error }
        }
        return { error: null }
    }, [save])

    const answers = useQuizAnimationStore(state => state.answers)

    const myChoicesIds = useMemo(() =>
        answers.filter(a => a.userId === userId).map(a => a.choiceId),
        [answers, userId]
    )

    return {
        toggleAnswer: toggleAnswer,
        setCurrentQuestionIndex: setCurrentQuestionIndex,
        setQuestionState: setQuestionState,
        isPending: isSaving,
        myChoicesIds: myChoicesIds
    }
}


/**
 * Close the current quiz in the store.
 * This empties the store and removes the snapshot from the database.
 */
export function useCloseQuizService(): {
    close: () => Promise<AsyncOperationResult>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const { save, isSaving } = useSaveQuizSnapshot()
    const roomId = useRoom().room?.id
    const { addEndActivityEvent } = useRoomEventsMutation(`${roomId}`)

    const close = useCallback(async () => {
        if (!roomId) return { error: 'No room id' }

        const state = useQuizAnimationStore.getState()
        if (!state.activityId) return { error: 'No activity id' }

        // Save this for the end event
        const activityId = state.activityId
        const answers = state.answers

        setIsPending(true)

        // Update the store
        state.closeQuiz()

        // Save the new state in the database
        const { error } = await save()
        if (error) {
            setIsPending(false)
            return { error }
        }

        setIsPending(false)

        if (!error) {
            addEndActivityEvent({
                type: 'quiz',
                activityId: `${activityId}`,
                answers: answers
            })
        }

        return { error: null }
    }, [roomId, save, addEndActivityEvent])

    return { close, isPending }
}

export function useSyncAnimationQuizService(): {
    isSyncing: boolean
    error: string | null
} {
    // Sync remote quiz data into the store
    //const { quiz, snapshot, isSyncing, error } = useSyncQuizService()
    const { activity, snapshot, isSyncing, error } = useRealtimeActivityContext()

    // Put the snapshot in the store
    useEffect(() => {
        if (snapshot && snapshot.type === 'quiz') {
            useQuizAnimationStore.getState().setActivityId(snapshot.activityId)
            useQuizAnimationStore.getState().setQuestionId(snapshot.currentQuestionId)
            useQuizAnimationStore.getState().setQuestionState(snapshot.state)
            useQuizAnimationStore.getState().setAnswers(snapshot.answers)
        } else {
            useQuizAnimationStore.getState().closeQuiz()
        }
    }, [snapshot])

    // Put the quiz in the store
    useEffect(() => {
        if (activity && activity.type === 'quiz') {
            useQuizAnimationStore.getState().setQuiz(activity)
        } else {
            useQuizAnimationStore.getState().closeQuiz()
        }
    }, [activity])

    return { isSyncing, error }
}

// Utils

/**
 * Save the current state of the quiz in the store, into the database.
 * Only used by the useQuizAnimationService hook.
 */
function useSaveQuizSnapshot(): {
    save: () => Promise<AsyncOperationResult>
    isSaving: boolean
} {
    const [isSaving, setIsSaving] = useState(false)
    const roomId = useRoom().room?.id

    const save = useCallback(async () => {
        if (!roomId) return { error: 'No room id' }

        setIsSaving(true)

        const state = useQuizAnimationStore.getState()

        if (!state.activityId || !state.currentQuestionId) {
            // Nothing in the store. It means the quiz is closed.
            const { error } = await saveActivitySnapshot(roomId, null)
            setIsSaving(false)
            return { error }
        }

        const snapshot: QuizSnapshot = {
            type: 'quiz',
            activityId: state.activityId,
            currentQuestionId: state.currentQuestionId,
            state: state.state,
            answers: state.answers
        }
        
        
        const { error } = await saveActivitySnapshot(roomId, snapshot)
        setIsSaving(false)
        return { error }
    }, [roomId])

    return { save, isSaving }
}