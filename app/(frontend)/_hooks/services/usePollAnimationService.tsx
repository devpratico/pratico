import logger from "@/app/_utils/logger"
import { saveRoomActivitySnapshot } from "@/app/(backend)/api/room/room.client"
import { fetchActivity } from "@/app/(backend)/api/activity/activitiy.client"
import { useEffect } from "react"
import { PollSnapshot, Poll } from "@/app/_types/poll2"
import usePollAnimationStore from "../stores/usePollAnimationStore"
import { useRoom } from "../contexts/useRoom"
import useSyncPollService from "./useSyncPollService"
import { useState } from "react"


/**
 * Open a poll in the store given its id.
 * This function fetches the activity from the database.
 */
export function useStartPollService(): {
    startPoll: (activityId: number | string) => Promise<void>
    isPending: boolean
    error: string | null
} {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const startPoll = async (activityId: number | string) => {
        setIsPending(true)
        setError(null)

        const id = parseInt(activityId as string)

        const { data, error } = await fetchActivity(id)

        if (error || !data) {
            logger.error('zustand:store', 'usePollAnimation', 'Error fetching activity', error)
            setError(error)
            setIsPending(false)
            return
        }

        if (!(data.type == 'poll')) {
            logger.error('zustand:store', 'usePollAnimation', 'Activity is not a poll')
            setError('Activity is not a poll')
            setIsPending(false)
            return
        }

        const poll = data.object as Poll

        usePollAnimationStore.getState().setPoll(poll)
        // No need to initialize some snapshot data, as the store contains default values

        setIsPending(false)
    }

    return { startPoll, isPending, error }
}


export function useSyncPollAnimationService(): {
    isSyncing: boolean
    error: string | null
} {
    const roomId = useRoom().room?.id
    //const { roomId } = args

    // Sync remote poll data into the store
    const { poll, snapshot, isSyncing, error } = useSyncPollService()

    // Put the snapshot in the store
    useEffect(() => {
        if (snapshot) {
            usePollAnimationStore.getState().setPollId(snapshot.activityId)
            usePollAnimationStore.getState().setAnswers(snapshot.answers)
            usePollAnimationStore.getState().setQuestionId(snapshot.currentQuestionId)
            usePollAnimationStore.getState().setQuestionState(snapshot.state)
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

    // Sync local state into the database
    // TODO: handle error
    useEffect(() => {
        if (!roomId) return
        return syncLocalState(roomId)
    }, [roomId])

    return { isSyncing, error }
}


// Utils

/**
 * Automatically save the local snapshot into the database.
 * Not only does it save every modification (current question, question state, answers...)
 * but it also it creates it if it doesn't exist, and removes it if the poll is null.
 */
function syncLocalState(roomId: number) {
    // TODO: use a hook to get the current room id
    const unsubscribe = usePollAnimationStore.subscribe(async (state, prevState) => {

        // If there is no poll, remove the snapshot from the database
        if (!state.poll) {
            logger.log('supabase:realtime', "usePollAnimationService.tsx", "Removing snapshot from database")
            await saveRoomActivitySnapshot(roomId, null)
            return
        }

        const snapshot = {
            type: 'poll',
            activityId: state.id,
            currentQuestionId: state.currentQuestionId,
            state: state.state,
            answers: state.answers
        } as PollSnapshot

        logger.log('supabase:realtime', "saving poll snapshot to database", snapshot)
        const { error } = await saveRoomActivitySnapshot(roomId, snapshot)

        if (error) {
            logger.log('supabase:realtime', "usePollAnimationService.tsx", "Error saving poll snapshot to database. Reverting back to previous state.", error)
            // TODO: Rollback to the previous state
        }
    })

    // Use this cleanup function to unsubscribe when the component unmounts
    return unsubscribe
}