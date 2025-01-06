'use client'
import { QuizSnapshot, QuizUserAnswer, Quiz } from "@/app/_types/quiz2"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useRoom } from "../contexts/useRoom"
import useQuizAnimationStore from "../stores/useQuizAnimationStore"
import { saveRoomActivitySnapshot } from "@/app/(backend)/api/room/room.client"
import { fetchActivity } from "@/app/(backend)/api/activity/activitiy.client"
import { useUser } from "../contexts/useUser"
import logger from "@/app/_utils/logger"
import { useRealtimeActivityContext } from "../contexts/useRealtimeActivityContext"


type AsyncOperationResult = { error: string | null }


export function useQuizAnimationService(): {
    toggleAnswer: (choiceId: string) => Promise<AsyncOperationResult>
    setCurrentQuestionIndex: (index: number) => Promise<AsyncOperationResult>
    setQuestionState: (state: QuizSnapshot['state']) => Promise<AsyncOperationResult>
    isPending: boolean
    myChoicesIds: string[]
} {
    const { save, isSaving } = useSaveRoomActivitySnapshot()
    const { userId } = useUser()

    const addAnswer = useCallback(async (choiceId: string): Promise<AsyncOperationResult> => {
        if (isSaving) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'Saving in progress')
            return { error: 'Saving in progress' }
        }
        if (!userId) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'No user id')
            return { error: 'No user id' }
        }

        const state = useQuizAnimationStore.getState()

        if (!state.currentQuestionId) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'No current question id')
            return { error: 'No current question id' }
        }

        // Check if the user has already answered this choice for this question
        const hasAlreadyAnswered = state.answers.some(answer =>
            answer.userId === userId &&
            answer.questionId === state.currentQuestionId &&
            answer.choiceId === choiceId
        )
        if (hasAlreadyAnswered) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'addAnswer', 'Already answered')
            return { error: 'Already answered' }
        }

        // Save the current answers in case of rollback
        const previousAnswers = state.answers

        // Add the answer optimistically in the store
        const newAnswer: QuizUserAnswer = {
            userId,
            questionId: state.currentQuestionId,
            choiceId,
            timestamp: Date.now()
        }

        state.addAnswer(newAnswer)

        // Save the new state in the database
        const { error } = await save()

        if (error) {
            // Rollback the store if the save failed
            state.setAnswers(previousAnswers)
            return { error }
        }
        return { error: null }
    }, [userId, save, isSaving])

    const removeAnswer = useCallback(async (choiceId: string): Promise<AsyncOperationResult> => {
        if (isSaving) return { error: 'Saving in progress' }
        if (!userId) return { error: 'No user id' }

        const state = useQuizAnimationStore.getState()

        if (!state.currentQuestionId) return { error: 'No current question id' }

        // Check if the user has answered this question
        const answer = state.answers.find(answer => 
            answer.userId === userId && 
            answer.questionId === state.currentQuestionId &&
            answer.choiceId === choiceId
        )
        if (!answer) return { error: 'No answer to remove' }

        // Save the current answers in case of rollback
        const previousAnswers = state.answers

        // Remove the answer optimistically in the store
        state.removeAnswer(answer)

        // Save the new state in the database
        const { error } = await save()

        if (error) {
            // Rollback the store if the save failed
            state.setAnswers(previousAnswers)
            return { error }
        }
        return { error: null }
    }, [userId, save, isSaving])

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
 * Set up a quiz in the store, coming from the database.
 */
/*
export function useStartQuizService(): {
    start: (activityId: string | number) => Promise<AsyncOperationResult>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const { save, isSaving } = useSaveRoomActivitySnapshot()
    const roomId = useRoom().room?.id

    const start = useCallback(async (activityId: string | number) => {
        if (!roomId) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'useStartQuizService', 'No room id')
            return { error: 'No room id' }
        }

        const state = useQuizAnimationStore.getState()
        if (state.activityId) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'useStartQuizService', 'A quiz is already started')
            return { error: 'A quiz is already started' }
        }

        setIsPending(true)

        const id = parseInt(activityId as string)
        const { data, error } = await fetchActivity(id)

        if (error || !data) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'useStartQuizService', 'Error fetching quiz: ' + error)
            setIsPending(false)
            return { error: 'Error fetching quiz: ' + error }
        }

        if (data.type !== 'quiz') {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'useStartQuizService', 'Not a quiz')
            setIsPending(false)
            return { error: 'Not a quiz' }
        }

        const quiz = data.object as Quiz

        // Update the store
        state.setQuiz(quiz)
        state.setActivityId(id)
        state.setQuestionId(quiz.questions[0].id)

        // Save the new state in the database
        const { error: saveError } = await save()
        if (saveError) {
            logger.error('zustand:store', 'useQuizAnimationService.tsx', 'useStartQuizService', 'Error saving quiz: ' + saveError)
            setIsPending(false)
            state.closeQuiz() // Rollback the store
            return { error: 'Error saving quiz: ' + saveError }
        }

        setIsPending(false)
        return { error: null }
    }, [roomId, save])

    return {start, isPending}
}*/

/**
 * Close the current quiz in the store.
 * This empties the store and removes the snapshot from the database.
 */
export function useCloseQuizService(): {
    close: () => Promise<AsyncOperationResult>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const { save, isSaving } = useSaveRoomActivitySnapshot()
    const roomId = useRoom().room?.id

    const close = useCallback(async () => {
        if (!roomId) return { error: 'No room id' }

        const state = useQuizAnimationStore.getState()
        if (!state.activityId) return { error: 'No activity id' }

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
        return { error: null }
    }, [roomId, save])

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
function useSaveRoomActivitySnapshot(): {
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
            const { error } = await saveRoomActivitySnapshot(roomId, null)
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
        
        
        const { error } = await saveRoomActivitySnapshot(roomId, snapshot)
        setIsSaving(false)
        return { error }
    }, [roomId])

    return { save, isSaving }
}