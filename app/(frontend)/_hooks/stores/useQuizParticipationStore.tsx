'use client'
import { QuizUserAnswer, Quiz, QuizSnapshot } from "@/app/_types/quiz"
import { create } from "zustand"
import { produce } from "immer"
import logger from "@/app/_utils/logger"

type State = {
    quiz: Quiz | null,
    quizId: string | null,
    currentQuestionId: string | null,
    state: QuizSnapshot['state'],
    answers: QuizUserAnswer[]
}

type Actions = {
    setQuiz: (quiz: Quiz | null) => void
    setSnapshot: (snapshot: QuizSnapshot | null) => void
    answer:       (arg0: {choiceId: string, userId: string}) => void
    removeAnswer: (arg0: {choiceId: string, userId: string}) => void
}

type Store = State & Actions

const useQuizParticipationStore = create<Store>((set, get) => ({

    quiz: null,
    quizId: null,
    currentQuestionId: null,
    state: 'answering',
    answers: [],

    setQuiz: (quiz) => {
        set(produce<State>(draft => {
            draft.quiz = quiz
        }))
    },

    setSnapshot: (snapshot) => {
        set(produce<State>(draft => {
            draft.answers = snapshot?.answers || []
            draft.currentQuestionId = snapshot?.currentQuestionId || null
            draft.state = snapshot?.state || 'answering'
            draft.quizId = snapshot?.activityId ? `${snapshot.activityId}` : null
        }))
    },

    answer: ({choiceId, userId}) => {
        if (!thereIsAQuiz()) {
            logger.error('zustand:store', 'useQuizParticipation.tsx', 'answer', 'No quiz found')
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

    removeAnswer: ({choiceId, userId}) => {
        if (!thereIsAQuiz()) {
            logger.error('zustand:store', 'useQuizParticipation.tsx', 'removeAnswer', 'No quiz found')
            return
        }

        set(produce<State>(draft => {
            draft.answers = draft.answers.filter(a =>
                !(a.choiceId == choiceId) && (a.userId == userId)
            )
        }))
    }
}))

export default useQuizParticipationStore

/** Checks if quiz, quizId and currentQuestionId are not null */
function thereIsAQuiz() {
    const state = useQuizParticipationStore.getState()
    return (
        state.quiz !== null &&
        state.quizId !== null &&
        state.currentQuestionId !== null
    )
}
