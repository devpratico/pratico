import { PollQuestion, PollUserAnswer, isPollSnapshot, Poll } from "@/app/_types/poll2"
import { create } from "zustand"
import { produce } from "immer"
import logger from "@/app/_utils/logger"
import { fetchActivity, fetchSnapshot } from "@/app/(backend)/api/activity/activitiy.client"
import createClient from "@/supabase/clients/client"
import { Tables } from "@/supabase/types/database.types"


type CurrentPoll = {
    question: PollQuestion,
    questionState: 'answering' | 'show results',
    answers: PollUserAnswer[]
}

type State = {
    currentPoll: CurrentPoll | null
}

type Actions = {
    vote:       ({choiceId, userId}: {choiceId: string, userId: string}) => void
    removeVote: ({choiceId, userId}: {choiceId: string, userId: string}) => void
}

type Store = State & Actions


const usePollParticipation = create<Store>((set, get) => ({

    currentPoll: null,

    vote: ({choiceId, userId}) => {
        const currentPoll = get().currentPoll

        if (!currentPoll) {
            logger.error('zustand:store', 'usePollParticipation.tsx', 'vote', 'No current poll')
            return
        }

        const newAnswer = {
            userId,
            timestamp: Date.now(),
            questionId: currentPoll.question.id,
            choiceId
        }

        set(produce<State>(draft => {
            draft.currentPoll!.answers.push(newAnswer)
        }))
    },

    removeVote: ({ choiceId, userId }) => {
        const currentPoll = get().currentPoll

        if (!currentPoll) {
            logger.error('zustand:store', 'usePollParticipation.tsx', 'removeVote', 'No current poll')
            return
        }

        set(produce<State>(draft => {
            draft.currentPoll!.answers = draft.currentPoll!.answers.filter(a =>
                a.choiceId !== choiceId && a.userId !== userId
            )
        }))
    }
}))

export default usePollParticipation


// SERVICES

/** Check if there is a snapshot in the database and populate the store with it */
async function loadRemoteSnapshot(roomId: number) {
    const { data: snapshotData } = await fetchSnapshot(roomId)
    const snapshot = snapshotData?.activity_snapshot

    if (!isPollSnapshot(snapshot)) {
        logger.log('zustand:store', 'usePollAnimation.tsx', 'No poll snapshot found in database')
        return
    }

    // Gather all the data needed to populate the store
    // Given the id of the activity, fetch the whole activity from the database
    const activityId = snapshot.activityId
    const { data, error } = await fetchActivity(activityId)

    if (error || !data) {
        logger.error('zustand:store', 'usePollAnimation.tsx', 'Error fetching activity', error)
        return
    }

    if (data.type !== 'poll') {
        logger.error('zustand:store', 'usePollAnimation.tsx', 'Activity is not a poll')
        return
    }

    const poll = data.object as Poll

    // Our store only needs the current question.
    // Let's find it in the poll object
    const question = poll.questions.find(q => q.id === snapshot.currentQuestionId)
    if (!question) {
        logger.error('zustand:store', 'usePollAnimation.tsx', 'Question not found in poll')
        return
    }
    // Also, we need the question state and the answers
    const questionState = snapshot.currentQuestionState
    const answers = snapshot.answers

    const currentPoll: CurrentPoll = {
        question,
        questionState,
        answers
    }

    // Now that we have gathered all the data, let's populate the store
    usePollParticipation.setState({ currentPoll })
}



function syncRemotePoll(roomId: number) {
    // Check if there is a snapshot in the database
    loadRemoteSnapshot(roomId)

    // Listen to changes in the database
    const supabase = createClient()
    const channel = supabase.channel(roomId + "_realtime")
    const roomUpdate = {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        //filter: `code=eq.${roomCode} AND status=eq.open`
        filter: `id=eq.${roomId}`
    } as any // TODO: handle type

    channel.on<Tables<'rooms'>>('postgres_changes', roomUpdate, (payload): void => {
        if (!(payload.eventType === 'UPDATE')) return
        const newRecord = payload.new
        const snapshot = newRecord.activity_snapshot
        logger.log('supabase:realtime', "activity snapshot updated", snapshot)



    }).subscribe()
}