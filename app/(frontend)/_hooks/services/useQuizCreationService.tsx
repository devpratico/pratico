'use client'
import { useState, useCallback } from "react"
import { saveActivity, fetchActivity } from "@/app/(backend)/api/activity/activitiy.client"
import logger from "@/app/_utils/logger"
import useQuizCreationStore from "../stores/useQuizCreationStore"
import { Quiz } from "@/core/domain/entities/activities/quiz"


export function useSaveQuizService(): {
    save: () => Promise<{error: string | null}>
    closeAndSave: () => Promise<{error: string | null}>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)

    const save = useCallback(async () => {
        setIsPending(true)

        const quiz = useQuizCreationStore.getState().quiz
        if (!quiz) {
            setIsPending(false)
            return {error: 'No quiz found'}
        }

        const id = useQuizCreationStore.getState().activityId
        // If no id is found, it means the quiz was never saved before
        // Save it and let Supabase give us an id
        if (!id) {
            const { data: saveData, error: saveError } = await saveActivity({ activity: quiz })
            setIsPending(false)
            if (saveError) {
                logger.error('zustand:store', 'useSaveQuizService.tsx', 'save', 'Error saving quiz: ' + saveError)
                return {error: saveError}
            }

            if (saveData?.id) useQuizCreationStore.getState().setActivityId(saveData.id)

        } else {
            // The id is already known
            // Id should be a number for supabase saveActvivity. Try parsing it as a number
            const parsedId = parseInt(id as string)

            const { error } = await saveActivity({ id: parsedId, activity: quiz })
            setIsPending(false)

            if (error) {
                logger.error('zustand:store', 'useSaveQuizService.tsx', 'save', 'Error saving quiz: ' + error)
                return {error: error}
            }
        }

        return {error: null}
    }, [])

    const closeAndSave = useCallback(async () => {
        useQuizCreationStore.getState().setShowQuizCreation(false)
        const res = await save()
        if (res) return res
        useQuizCreationStore.getState().removeQuiz()
        return { error: null }
    }, [save])

    return { save, closeAndSave, isPending}
}



/*export function useOpenQuizService(): {
    openQuiz: (activityId: number) => Promise<{error: string | null}>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)

    const openQuiz = useCallback(async (activityId: number) => {
        setIsPending(true)
        const { data, error } = await fetchActivity(activityId)
        setIsPending(false)

        if (error || !data?.object) {
            logger.error('supabase:database', `Error opening quiz ${activityId}`, error)
            return { error: error ?? 'No data found' }
        }

        if (data.object.type !== 'quiz') {
            logger.error('supabase:database', `Error opening quiz ${activityId}`, 'Activity is not a quiz')
            return { error: 'Activity is not a quiz' }
        }

        const quiz = data.object as Quiz

        useQuizCreationStore.getState().openQuiz(activityId, quiz)
        return { error: null }
    }, [])

    return { openQuiz, isPending }
}*/