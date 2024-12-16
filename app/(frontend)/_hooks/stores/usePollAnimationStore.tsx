import { Poll, PollUserAnswer, PollSnapshot } from "@/app/_types/poll2"
import { create } from "zustand"
import { produce } from "immer"



type Id = number | string

/** Looks a lot like PollSnapshot, but I prefer to keep client code and server code decoupled */
type CurrentPoll = {
    id: Id,
    poll: Poll
    currentQuestionId: string
    state: PollSnapshot['state']
    answers: PollUserAnswer[]
}

type PollState = {
    /** The activity to show, if any */
    currentPoll: CurrentPoll | null

    /** true while syncing with the database */
    isSyncing: boolean
}

type PollActions = {
    setPoll: (poll: Poll, id: Id) => void
    //setPollId: (id: Id) => void
    closePoll: () => void
    setAnswers: (answers: PollUserAnswer[]) => void
    addAnswer: (answer: PollUserAnswer) => void
    removeAnswer: (answerId: string) => void
    changeQuestionId: (questionId: string) => void
    changeQuestionState: (state: CurrentPoll['state']) => void
}

type PollStore = PollState & PollActions


const usePollAnimationStore = create<PollStore>((set, get) => ({
    
    currentPoll: null,

    isSyncing: false,

    setPoll: (poll, id) => {
        set(produce<PollState>(draft => {
            // If currentPoll already exists, just update the poll object
            if (draft.currentPoll) {
                draft.currentPoll.poll = poll
                draft.currentPoll.id = id
                return
            }

            // If there is no currentPoll, create a new one with empty snapshot data
            draft.currentPoll = {
                id: id,
                poll: poll,
                currentQuestionId: poll.questions[0].id,
                state: 'voting',
                answers: []
            }
        }))
    },

    /*setPollId: (id) => {
        set(produce<PollState>(draft => {
            if (!draft.currentPoll) return
            draft.currentPoll.id = id
        }))
    },*/

    closePoll: () => {
        set({ currentPoll: null })
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
            draft.currentPoll!.answers = draft.currentPoll!.answers.filter(a => a.choiceId !== answerId)
        }))
    },

    changeQuestionId: (questionId) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.currentQuestionId = questionId
        }))
    },

    changeQuestionState: (state) => {
        set(produce<PollState>(draft => {
            draft.currentPoll!.state = state
        }))
    }

}))

export default usePollAnimationStore
