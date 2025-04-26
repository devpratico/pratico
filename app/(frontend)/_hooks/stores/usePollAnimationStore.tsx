'use client'
import { Poll, PollUserAnswer, PollSnapshot } from "@/domain/entities/activities/poll"
import { create } from "zustand"
import { produce } from "immer"


type PollState = {
    id: number | string | null
    poll: Poll | null
    currentQuestionId: string | null
    state: PollSnapshot['state']
    answers: PollUserAnswer[]
}

type PollActions = {
    setPoll: (poll: Poll) => void
    setPollId: (id: PollState['id']) => void
    closePoll: () => void
    setAnswers: (answers: PollUserAnswer[]) => void
    addAnswer: (answer: PollUserAnswer) => void
    removeAnswer: ({userId, questionId, choiceId}: {userId: string, questionId: string, choiceId: string}) => void
    setQuestionId: (questionId: string) => void
    setQuestionState: (state: PollState['state']) => void
}

type PollStore = PollState & PollActions

/**
 * Store for managing the poll animation state
 * This shouldn't be used directly in the components, but rather through the usePollAnimationService hook
 */
const usePollAnimationStore = create<PollStore>((set, get) => ({
    
    id: null,

    poll: null,

    currentQuestionId: null,

    state: 'voting',

    answers: [],

    setPoll: (poll) => {
        set(produce<PollState>(draft => {
            draft.poll = poll
        }))
    },

    setPollId: (id) => {
        set(produce<PollState>(draft => {
            draft.id = id
        }))
    },

    closePoll: () => {
        set(produce<PollState>(draft => {
            draft.poll = null
            draft.id = null
            draft.currentQuestionId = null
            draft.state = 'voting'
            draft.answers = []
        }))
    },

    setAnswers: (answers) => {
        set(produce<PollState>(draft => {
            draft.answers = answers
        }))
    },

    addAnswer: (answer) => {
        set(produce<PollState>(draft => {
            draft.answers.push(answer)
        }))
    },

    removeAnswer: ({userId, questionId, choiceId}) => {
        set(produce<PollState>(draft => {
            draft.answers = draft.answers.filter( a => {
                return !(a.userId === userId && a.questionId === questionId && a.choiceId === choiceId)
            })
        }))
    },

    setQuestionId: (questionId) => {
        set(produce<PollState>(draft => {
            draft.currentQuestionId = questionId
        }))
    },

    setQuestionState: (state) => {
        set(produce<PollState>(draft => {
            draft.state = state
        }))
    }

}))

export default usePollAnimationStore
