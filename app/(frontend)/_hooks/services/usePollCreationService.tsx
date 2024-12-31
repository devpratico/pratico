'use client'
import { saveActivity, fetchActivity } from "@/app/(backend)/api/activity/activitiy.client"
import usePollCreationStore from "../stores/usePollCreationStore"
import logger from "@/app/_utils/logger"
import { useState } from "react"
import { Poll } from "@/app/_types/poll"


/**
 * Saves the current poll to the database
 * Use this for poll creation ('save' button)
 */
export function useSavePollService(): {
    savePoll: () => Promise<void>
    closePollAndSave: () => Promise<void>
    isPending: boolean
    error: string | null
} {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const savePoll = async () => {
        setIsPending(true)
        setError(null)

        const poll = usePollCreationStore.getState().currentPoll?.poll
        if (!poll) {
            logger.error('zustand:store', 'useSavePollService.tsx', 'savePoll', 'Cant save poll because no current poll found')
            setIsPending(false)
            setError('Cant save poll because no current poll found')
            return
        }
        
        const id = usePollCreationStore.getState().currentPoll?.id
        // If no id is found, it means the poll was never saved before
        // Save it and let Supabase give us an id
        if (!id) {
            const { data, error: saveError } = await saveActivity({ activity: poll })
            setIsPending(false)
            if (saveError) {
                setError(saveError)
                logger.error('zustand:store', 'useSavePollService.tsx', 'savePoll', 'Error saving poll: ' + saveError)
            }

            // Save the id for future updates
            if (data?.id) usePollCreationStore.getState().setPollId(data.id)

        } else {
            // The id is already known
            // Id should be a number for supabase saveActvivity. Try parsing it as a number
            const parsedId = parseInt(id as string)

            const { error } = await saveActivity({ id: parsedId, activity: poll })
            setIsPending(false)

            if (error) {
                setError(error)
                logger.error('zustand:store', 'useSavePollService.tsx', 'savePoll', 'Error saving poll: ' + error)
            }
        }
    }

    const closePollAndSave = async () => {
        usePollCreationStore.getState().setShowPollCreation(false)
        await savePoll()
        usePollCreationStore.getState().deletePoll()
    }

    return { savePoll, closePollAndSave, isPending, error }
}



/*export function useOpenPollService():{
    openPoll: (activityId: number) => Promise<void>
    isPending: boolean
    error: string | null
} {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const openPoll = async (activityId: number) => {
        setIsPending(true)
        setError(null)

        const { data, error } = await fetchActivity(activityId)

        if (error || !data) {
            logger.error('zustand:store', 'useOpenPollService', 'Error fetching activity', error)
            setError(error)
            setIsPending(false)
            return
        }

        if (!(data.type == 'poll')) {
            logger.error('zustand:store', 'useOpenPollService', 'Activity is not a poll')
            setError('Activity is not a poll')
            setIsPending(false)
            return
        }

        const poll = data.object as Poll

        usePollCreationStore.getState().openPoll({id: activityId, poll})
        setIsPending(false)
    }

    return { openPoll, isPending, error }
}*/