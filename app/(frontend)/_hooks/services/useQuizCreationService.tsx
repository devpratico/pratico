'use client'
import { useState, useCallback } from "react"
import { saveActivity } from "@/app/(backend)/api/activity/activitiy.client"
import logger from "@/app/_utils/logger"
import useQuizCreationStore from "../stores/useQuizCreationStore"


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