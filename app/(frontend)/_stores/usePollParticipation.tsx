import { PollQuestion, PollUserAnswer, isPollSnapshot, Poll, PollSnapshot } from "@/app/_types/poll2"
import { create } from "zustand"
import { produce } from "immer"
import logger from "@/app/_utils/logger"
import { fetchActivity, fetchSnapshot } from "@/app/(backend)/api/activity/activitiy.client"
import createClient from "@/supabase/clients/client"
import { Tables } from "@/supabase/types/database.types"
import { useEffect } from "react"


type State = {
    poll: Poll | null,
    pollId: number | null,
    currentQuestionId: string | null,
    state: PollSnapshot['state'],
    answers: PollUserAnswer[]
}

type Actions = {
    vote:       ({choiceId, userId}: {choiceId: string, userId: string}) => void
    removeVote: ({choiceId, userId}: {choiceId: string, userId: string}) => void
}

type Store = State & Actions


const usePollParticipation = create<Store>((set, get) => ({

    poll: null,
    pollId: null,
    currentQuestionId: null,
    state: 'voting',
    answers: [],

    vote: ({choiceId, userId}) => {
        if (!thereIsAPoll()) {
            logger.error('zustand:store', 'usePollParticipation.tsx', 'vote', 'No poll found')
            return
        }

        const newAnswer = {
            userId: userId,
            timestamp: Date.now(),
            questionId: get().currentQuestionId!,
            choiceId: choiceId
        }

        set(produce<State>(draft => {
            draft.answers.push(newAnswer)
        }))
    },

    removeVote: ({ choiceId, userId }) => {
        if (!thereIsAPoll()) {
            logger.error('zustand:store', 'usePollParticipation.tsx', 'removeVote', 'No poll found')
            return
        }

        set(produce<State>(draft => {
            draft.answers = draft.answers.filter(a =>
                a.choiceId !== choiceId && a.userId !== userId
            )
        }))
    }
}))

export default usePollParticipation


// SERVICES

/** Checks if poll, pollId and currentQuestionId are not null */
function thereIsAPoll() {
    const state = usePollParticipation.getState()
    return (
        state.poll !== null &&
        state.pollId !== null &&
        state.currentQuestionId !== null
    )
}

/** Fetches the poll from the activities table and populates the store */
async function loadPoll(activityId: number) {
    const { data, error } = await fetchActivity(activityId)

    if (error || !data) {
        logger.error('zustand:store', 'usePollParticipation.tsx', 'loadPoll', 'Error fetching activity', error)
        return undefined
    }

    if (data.type !== 'poll') {
        logger.error('zustand:store', 'usePollParticipation.tsx', 'loadPoll', 'Activity is not a poll')
        return undefined
    }

    const poll =  data.object as Poll

    usePollParticipation.setState(produce<State>(draft => {
        draft.poll = poll
        draft.currentQuestionId = null
        //draft.pollId = activityId
    }))
}

/** Fetches the snapshot from the room table and populates the store */
async function loadSnapshot(roomId: number) {
    const { data } = await fetchSnapshot(roomId)
    const snapshot = data?.activity_snapshot

    if (!isPollSnapshot(snapshot)) {
        logger.log('zustand:store', 'usePollParticipation.tsx', 'loadSnapshot', 'No poll snapshot found in database')
        return
    }

    usePollParticipation.setState(produce<State>(draft => {
        draft.answers = snapshot.answers
        draft.currentQuestionId = snapshot.currentQuestionId
        draft.state = snapshot.state
        draft.pollId = snapshot.activityId
    }))
}


/**
 * Syncs the local store with the remote database:
 * - Initializes the store with the current snapshot and poll if they exist
 * - Subscribes to the changes in the room table (Supabase realtime)
 */
async function syncRemotePoll(roomId: number) {
    // Fetch the snapshot if it exists
    await loadSnapshot(roomId)

    // Fetch the poll if it exists
    const pollId = usePollParticipation.getState().pollId
    if (pollId) await loadPoll(pollId)

    // Listen to changes in the database
    const supabase = createClient()
    const channel = supabase.channel(roomId + "_realtime") // TODO: should this name be different than in usePollAnimation ?
    const roomUpdate = {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}` //filter: `code=eq.${roomCode} AND status=eq.open`
    } as any // TODO: handle type?

    channel.on<Tables<'rooms'>>('postgres_changes', roomUpdate, async (payload): Promise<void> => {
        if (!(payload.eventType === 'UPDATE')) return
        const newRecord = payload.new
        const snapshot = newRecord.activity_snapshot

        if (!isPollSnapshot(snapshot)) {
            // It has been deleted or changed to an other activity snapshot
            // Reset the store
            usePollParticipation.setState(produce<State>(draft => {
                draft.poll = null
                draft.pollId = null
                draft.currentQuestionId = null
                draft.state = 'voting'
                draft.answers = []
            }))
            return
        }

        // The snapshot has changed.
        // Load the new snapshot data
        usePollParticipation.setState(produce<State>(draft => {
            draft.answers = snapshot.answers
            draft.currentQuestionId = snapshot.currentQuestionId
            draft.state = snapshot.state
            draft.pollId = snapshot.activityId
        }))

        // If the activity id has changed, load the new activity
        if(snapshot.activityId !== usePollParticipation.getState().pollId) {
            await loadPoll(snapshot.activityId)
        }
    }).subscribe()

    return () => supabase.removeChannel(channel)
}


/** Hook to sync the local store with the remote database */
export function useSyncedPoll(roomId: number) {
    useEffect(() => {
        syncRemotePoll(roomId).then(unsubscribe => {
            return unsubscribe
        })
    }, [roomId])
}


export function vote(choiceId: string) {

}