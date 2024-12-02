'use client'
import { Poll, PollUserAnswer } from "@/app/_types/poll2"
import { create } from "zustand"
import { produce } from "immer"
//import logger from "@/app/_utils/logger"
//import { uniqueTimestampId } from "@/app/_utils/utils_functions"


type Id = number | string

type CurrentPollSnapshot = {
    id: Id,
    poll: Poll
    currentQuestionId: string
    questionState: 'answering' | 'show results'
    answers: PollUserAnswer[]
}

type PollSnapshotState = {
    /** Wether or not to show the activity*/
    shouldShowPoll: boolean

    /** The activity to show, if any */
    currentPoll: CurrentPollSnapshot | null
}

type PollSnapshotActions = {
    openPoll: (poll: Poll, id: Id) => void
    closePoll: () => void
    setAnswers: (answers: PollUserAnswer[]) => void
    addAnswer: (answer: PollUserAnswer) => void
    removeAnswer: (answerId: string) => void
    changeQuestionId: (questionId: string) => void
    changeQuestionState: (state: CurrentPollSnapshot['questionState']) => void
}

type PollSnapshotStore = PollSnapshotState & PollSnapshotActions


const usePollSnapshotStore = create<PollSnapshotStore>((set, get) => ({

    shouldShowPoll: false,
    currentPoll: null,

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
        set(produce<PollSnapshotState>(draft => {
            draft.currentPoll!.answers = answers
        }))
    },

    addAnswer: (answer) => {
        set(produce<PollSnapshotState>(draft => {
            draft.currentPoll!.answers.push(answer)
        }))
    },

    removeAnswer: (answerId) => {
        set(produce<PollSnapshotState>(draft => {
            draft.currentPoll!.answers = draft.currentPoll!.answers.filter(a => a.userId !== answerId)
        }))
    },

    changeQuestionId: (questionId) => {
        set(produce<PollSnapshotState>(draft => {
            draft.currentPoll!.currentQuestionId = questionId
        }))
    },

    changeQuestionState: (state) => {
        set(produce<PollSnapshotState>(draft => {
            draft.currentPoll!.questionState = state
        }))
    }

}))

export default usePollSnapshotStore