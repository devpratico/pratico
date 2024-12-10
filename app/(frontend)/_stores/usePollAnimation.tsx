import { Poll, PollUserAnswer, isPollSnapshot, PollSnapshot } from "@/app/_types/poll2"
import { create } from "zustand"
import { produce } from "immer"
import { isEqual } from "lodash"
import logger from "@/app/_utils/logger"
//import { uniqueTimestampId } from "@/app/_utils/utils_functions"
import createClient from "@/supabase/clients/client"
import { Tables } from "@/supabase/types/database.types"
import { saveRoomActivitySnapshot } from "@/app/(backend)/api/room/room.client"
import { fetchActivity, fetchSnapshot } from "@/app/(backend)/api/activity/activitiy.client"
import { useEffect } from "react"


type Id = number | string

/** Looks a lot like PollSnapshot, but I prefer to keep client code and server code decoupled */
type CurrentPoll = {
    id: Id,
    poll: Poll
    currentQuestionId: string
    questionState: 'answering' | 'show results'
    answers: PollUserAnswer[]
}

type PollState = {
    /** Wether or not to show the activity*/
    shouldShowPoll: boolean

    /** The activity to show, if any */
    currentPoll: CurrentPoll | null

    /** true while syncing with the database */
    isSyncing: boolean
}

type PollActions = {
    openPoll: (poll: Poll, id: Id) => void
    closePoll: () => void
    setAnswers: (answers: PollUserAnswer[]) => void
    addAnswer: (answer: PollUserAnswer) => void
    removeAnswer: (answerId: string) => void
    changeQuestionId: (questionId: string) => void
    changeQuestionState: (state: CurrentPoll['questionState']) => void
}

type PollStore = PollState & PollActions


const usePollAnimation = create<PollStore>((set, get) => ({

    shouldShowPoll: false,
    
    currentPoll: null,

    isSyncing: false,

    openPoll: (poll, id) => {
        set({
            shouldShowPoll: true,
            currentPoll: {
                id: id,
                poll: poll,
                currentQuestionId: poll.questions[0].id,
                questionState: 'answering',
                answers: []
            }
        })
    },

    closePoll: () => {
        set({ shouldShowPoll: false, currentPoll: null })
    },

    setAnswers: (answers) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.answers = answers
        }))
    },

    addAnswer: (answer) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.answers.push(answer)
        }))
    },

    removeAnswer: (answerId) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.answers = draft.currentPoll!.answers.filter(a => a.userId !== answerId)
        }))
    },

    changeQuestionId: (questionId) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.currentQuestionId = questionId
        }))
    },

    changeQuestionState: (state) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.questionState = state
        }))
    }

}))

export default usePollAnimation


// SERVICES

/**
 * Open a poll in the store given its id.
 * This function fetches the activity from the database.
 */
export async function openPoll(id: Id) {
    id = parseInt(id as string)

    const { data , error } = await fetchActivity(id)

    if (error || !data) {
        logger.error('zustand:store', 'usePollAnimation', 'Error fetching activity', error)
        return
    }

    if (!(data.type == 'poll')) {
        logger.error('zustand:store', 'usePollAnimation', 'Activity is not a poll')
        return
    }

    const poll = data.object as Poll

    usePollAnimation.getState().openPoll(poll, id)
}

/** On first load, check the existence of a snapshot in the database and load it if it exists */
async function loadSnapshotIfAny(roomId: number) {
    const { data }= await fetchSnapshot(roomId)
    const snapshot = data?.activity_snapshot
    if (isPollSnapshot(snapshot)) {
        // TODO: be careful, may trigger a loop
        const activityId = snapshot.activityId
        await openPoll(activityId) // Sets the polll with empty answers
        usePollAnimation.getState().setAnswers(snapshot.answers) // Sets the answers
    } else {
        logger.log('zustand:store', 'usePollAnimation.tsx', 'No poll snapshot found in database')
    }
}

/**
 * Any time the answers change in the database, update them in the state.
 * - When a student answers a question
 * - When the teacher answers a question
 * If there is no snapshot, nothing happens. The poll is not closed.
 * This function should be called once when the poll is opened.
 */
function syncRemoteAnswers(roomId: number) {
    const supabase = createClient()
    const channel  = supabase.channel(roomId + "_realtime")
    const roomUpdate = {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        //filter: `code=eq.${roomCode} AND status=eq.open`
        filter: `id=eq.${roomId}`
    } as any // TODO: handle type

    channel.on('postgres_changes', roomUpdate , (payload): void => {
        const newRecord = payload.new as Tables<'rooms'>
        const snapshot = newRecord.activity_snapshot
        logger.log('supabase:realtime', "activity snapshot updated", snapshot)

        if (!isPollSnapshot(snapshot)) {
            logger.log('supabase:realtime', "activity snapshot is not a poll. Doing nothing.")
            return
        }

        const newAnswers = (snapshot as PollSnapshot).answers
        const oldAnswers = usePollAnimation.getState().currentPoll?.answers

        if (isEqual(newAnswers, oldAnswers)) {
            logger.log('supabase:realtime', "usePollAnimation.tsx", "answers are the same. Doing nothing.")
            return
        }

        //usePollAnimation.getState().setAnswers(newAnswers)
        
    }).subscribe()


    // Use this cleanup function to remove the channel when the component unmounts
    return () => supabase.removeChannel(channel)
}


/**
 * Automatically save the local snapshot into the database.
 * Not only does it save every modification (current question, question state, answers...)
 * but it also it creates it if it doesn't exist, and removes it if the poll is null.
 */
function syncLocalState(roomId: number) {
    // TODO: use subscribeWithSelector to only subscribe to currentPoll, and use the isSyncing flag
    const unsubscribe = usePollAnimation.subscribe(async (state, prevState) => {

        const currentPoll = state.currentPoll

        // If there is no poll, remove the snapshot from the database
        if (!currentPoll) {
            logger.log('supabase:realtime', "usePollAnimation.tsx", "Removing snapshot from database")
            await saveRoomActivitySnapshot(roomId, null)
            return
        }

        const snapshot = {
            type: 'poll',
            activityId: currentPoll.id,
            currentQuestionId: currentPoll.currentQuestionId,
            currentQuestionState: currentPoll.questionState,
            answers: currentPoll.answers
        } as PollSnapshot

        logger.log('supabase:realtime', "saving poll snapshot to database", snapshot)
        const { error } = await saveRoomActivitySnapshot(roomId, snapshot)

        if (error) {
            logger.log('supabase:realtime', "usePollAnimation.tsx", "Error saving poll snapshot to database. Reverting back to previous state.", error)
            // TODO: Rollback to the previous state
        }


    })

    // Use this cleanup function to unsubscribe when the component unmounts
    return unsubscribe
}


/**
 * Use this hook to automatically sync the poll animation store with the database.
 */
export function useSyncedPollAnimation(roomId: number) {
    useEffect(() => {
        loadSnapshotIfAny(roomId).then(() => {
            const cleanupLocal  = syncLocalState(roomId)
            const cleanupRemote = syncRemoteAnswers(roomId)

            return () => {
                cleanupLocal()
                cleanupRemote()
            }
        })
    }, [roomId])
}