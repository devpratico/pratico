'use client'
import { Quiz, QuizSnapshot, QuizUserAnswer } from "@/app/_types/quiz"
import { create } from "zustand"
import { produce } from "immer"


type QuizState = {
    activityId: number | string | null
    quiz: Quiz | null
    currentQuestionId: string | null
    state: QuizSnapshot['state']
    answers: QuizUserAnswer[]
}

type QuizActions = {
    setQuiz: (quiz: Quiz) => void
    setActivityId: (id: QuizState['activityId']) => void
    closeQuiz: () => void
    setAnswers: (answers: QuizUserAnswer[]) => void
    addAnswer: (answer: QuizUserAnswer) => void
    removeAnswer: (args: {userId: string, questionId: string, choiceId: string}) => void
    setQuestionId: (questionId: string) => void
    setQuestionState: (state: QuizState['state']) => void
}

type QuizStore = QuizState & QuizActions

/**
 * Store for managing the quiz animation state
 * This shouldn't be used directly in the components, but rather through the useQuizAnimationService hook
 */
const useQuizAnimationStore = create<QuizStore>((set, get) => ({
    
    activityId: null,

    quiz: null,

    currentQuestionId: null,

    state: 'answering',

    answers: [],

    setQuiz: (quiz) => {
        set(produce<QuizState>(draft => {
            draft.quiz = quiz
        }))
    },

    setActivityId: (id) => {
        set(produce<QuizState>(draft => {
            draft.activityId = id
        }))
    },

    closeQuiz: () => {
        set(produce<QuizState>(draft => {
            draft.quiz = null
            draft.activityId = null
            draft.currentQuestionId = null
            draft.answers = []
        }))
    },

    setAnswers: (answers) => {
        set(produce<QuizState>(draft => {
            draft.answers = answers
        }))
    },

    addAnswer: (answer) => {
        set(produce<QuizState>(draft => {
            draft.answers.push(answer)
        }))
    },

    removeAnswer: ({userId, questionId, choiceId}) => {
        set(produce<QuizState>(draft => {
            draft.answers = draft.answers.filter(a => !(a.userId === userId && a.questionId === questionId && a.choiceId === choiceId))
        }))
    },

    setQuestionId: (questionId) => {
        set(produce<QuizState>(draft => {
            draft.currentQuestionId = questionId
        }))
    },

    setQuestionState: (state) => {
        set(produce<QuizState>(draft => {
            draft.state = state
        }))
    },
}))

export default useQuizAnimationStore