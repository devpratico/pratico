'use client'
import { saveActivity } from "@/app/(backend)/api/activity/activitiy.client"
import usePollCreationStore from "../stores/usePollCreationStore"
import logger from "@/app/_utils/logger"
import { useState } from "react"


interface UseSavePollServiceReturn {
    savePoll: () => Promise<void>
    isPending: boolean
    error: string | null
}

/**
 * Saves the current poll to the database
 * Use this for poll creation ('save' button)
 */
export function useSavePollService(): UseSavePollServiceReturn {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const savePoll = async () => {
        setIsPending(true)
        setError(null)

        const poll = usePollCreationStore.getState().currentPoll?.poll
        const id   = usePollCreationStore.getState().currentPoll?.id
        if (!poll || !id) {
            logger.error('zustand:store', 'useSavePollService.tsx', 'savePoll', 'Cant save poll because no current poll found')
            setIsPending(false)
            setError('Cant save poll because no current poll found')
            return
        }

        // Id should be a number for supabase saveActvivity. Try parsing it as a number
        const parsedId = parseInt(id as string)

        usePollCreationStore.getState().closePoll() // Remove the poll from the store

        const { error } = await saveActivity({ id: parsedId, activity: poll })
        setIsPending(false)

        if (error) {
            setError(error)
            logger.error('zustand:store', 'useSavePollService.tsx', 'savePoll', 'Error saving poll: ' + error)
        }
    }

    return { savePoll, isPending, error }
}