'use client'
import { PollUserAnswer, Poll, PollSnapshot } from "@/app/_types/poll2"
import { create } from "zustand"
import { produce } from "immer"
import logger from "@/app/_utils/logger"


//type State = Poll & PollSnapshot | null

type State = {
    poll: Poll | null,
    pollId: number | null,
    currentQuestionId: string | null,
    state: PollSnapshot['state'],

    /** These will only be this user's answers */
    answers: PollUserAnswer[]
}


type Actions = {
    setPoll: (poll: Poll | null) => void
    setSnapshot: (snapshot: PollSnapshot | null) => void
    vote:       (arg0: {choiceId: string, userId: string}) => void
    removeVote: (arg0: {choiceId: string, userId: string}) => void
}

type Store = State & Actions


const usePollParticipationStore = create<Store>((set, get) => ({

    poll: null,
    pollId: null,
    currentQuestionId: null,
    state: 'voting',
    answers: [],

    setPoll: (poll) => {
        set(produce<State>(draft => {
            draft.poll = poll
        }))
    },

    setSnapshot: (snapshot) => {
        set(produce<State>(draft => {
            draft.answers = snapshot?.answers || []
            draft.currentQuestionId = snapshot?.currentQuestionId || null
            draft.state = snapshot?.state || 'voting'
            draft.pollId = snapshot?.activityId || null
        }))
    },

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

    removeVote: ({choiceId, userId}) => {
        if (!thereIsAPoll()) {
            logger.error('zustand:store', 'usePollParticipation.tsx', 'removeVote', 'No poll found')
            return
        }

        set(produce<State>(draft => {
            draft.answers = draft.answers.filter(a =>
                !(a.choiceId == choiceId) && (a.userId == userId)
            )
        }))
    }
}))

export default usePollParticipationStore


/** Checks if poll, pollId and currentQuestionId are not null */
function thereIsAPoll() {
    const state = usePollParticipationStore.getState()
    return (
        state.poll !== null &&
        state.pollId !== null &&
        state.currentQuestionId !== null
    )
}




