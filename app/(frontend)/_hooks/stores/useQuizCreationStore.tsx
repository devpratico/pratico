import { Quiz } from "@/app/_types/quiz2"
import { create } from "zustand"
import { produce } from "immer"
import logger from "@/app/_utils/logger"
import { emptyQuiz } from "@/app/_types/quiz2"
import { uniqueTimestampId } from "@/app/_utils/utils_functions"


type Id = number | string

type QuizCreationState = {
    activityId?: Id
    quiz?: Quiz
    currentQuestionId?: string
    showQuizCreation: boolean
}

type QuizCreationActions = {
    openEmptyQuiz: () => void
    openQuiz: (activityId: Id, quiz: Quiz) => void
    showPollCreation: (show?: boolean) => void
    removeQuiz: () => void
    setTitle: (title: string) => void
    setCurrentQuestion: (arg: { id: string } | { index: number }) => void
    addEmptyQuestion: () => void
    setQuestionText: (arg: { id: string, text: string }) => void
    removeQuestion: (id: string) => void
    duplicateQuestion: (id: string) => void
    addEmptyChoice: (questionId: string) => void
    setChoiceText: (id: string, text: string) => void
    setChoiceCorrect: (id: string, isCorrect: boolean) => void
    removeChoice: (id: string) => void
}

type QuizCreationStore = QuizCreationState & QuizCreationActions

const useQuizCreationStore = create<QuizCreationStore>((set, get) => ({
    showQuizCreation: false,
    quiz: undefined,
    activityId: undefined,
    currentQuestionId: undefined,

    openEmptyQuiz: () => {
        set({
            showQuizCreation: true,
            quiz: emptyQuiz,
            activityId: undefined,
            currentQuestionId: undefined
        })
    },

    openQuiz: (activityId, quiz) => {
        if (quiz.questions.length === 0) {
            logger.error('zustand:action', 'Cannot open a quiz with no questions (array length is 0)')
            return
        }
        set({
            showQuizCreation: true,
            quiz,
            activityId,
            currentQuestionId: quiz.questions[0].id
        })
    },

    showPollCreation: (show = true) => {
        set({ showQuizCreation: show })
    },

    removeQuiz: () => {
        set({ showQuizCreation: false, quiz: undefined, activityId: undefined, currentQuestionId: undefined })
    },

    setTitle: (title) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot set the title of a non-existing quiz')
            return
        }
        set(produce<QuizCreationStore>(state => {
            state.quiz!.title = title
        }))
    },

    setCurrentQuestion: (arg) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot change the current question of a non-existing quiz')
            return
        }
        set(state => {
            const quiz = state.quiz!
            const id = 'id' in arg ? arg.id : quiz.questions[arg.index].id
            return { currentQuestionId: id }
        })
    },

    addEmptyQuestion: () => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot add a question to a non-existing quiz')
            return
        }
        const newQuestionId = uniqueTimestampId('question-')
        const newQuestion = { id: newQuestionId, text: '', choices: [] }
        set(produce<QuizCreationStore>(state => {
            state.quiz!.questions.push(newQuestion)
            state.currentQuestionId = newQuestionId
        }))
    },

    setQuestionText: ({ id, text }) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot change the text of a question in a non-existing quiz')
            return
        }
        set(produce<QuizCreationStore>(state => {
            const question = state.quiz!.questions.find(q => q.id === id)
            if (question) question.text = text
        }))
    },

    removeQuestion: (id) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot remove a question from a non-existing quiz')
            return
        }
        set(produce<QuizCreationStore>(state => {
            state.quiz!.questions = state.quiz!.questions.filter(q => q.id !== id)
        }))
    },

    duplicateQuestion: (id) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot duplicate a question in a non-existing quiz')
            return
        }
        const newQuestionId = uniqueTimestampId('question-')
        set(produce<QuizCreationStore>(state => {
            const question = state.quiz!.questions.find(q => q.id === id)
            if (question) {
                const newQuestion = { ...question, id: newQuestionId }
                const index = state.quiz!.questions.findIndex(q => q.id === id)
                state.quiz!.questions.splice(index + 1, 0, newQuestion)
                state.currentQuestionId = newQuestionId
            }
        }))
    },

    addEmptyChoice: (questionId) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot add a choice to a question in a non-existing quiz')
            return
        }
        set(produce<QuizCreationStore>(state => {
            const question = state.quiz!.questions.find(q => q.id === questionId)
            if (question) question.choices.push({
                id: uniqueTimestampId('choice-'),
                text: '',
                isCorrect: false
            })
        }))
    },

    setChoiceText: (id, text) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot change the text of a choice in a non-existing quiz')
            return
        }
        set(produce<QuizCreationStore>(state => {
            const choice = state.quiz!.questions.flatMap(q => q.choices).find(c => c.id === id)
            if (choice) choice.text = text
        }))
    },

    setChoiceCorrect: (id, isCorrect) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot change the correctness of a choice in a non-existing quiz')
            return
        }
        set(produce<QuizCreationStore>(state => {
            const choice = state.quiz!.questions.flatMap(q => q.choices).find(c => c.id === id)
            if (choice) choice.isCorrect = isCorrect
        }))
    },

    removeChoice: (id) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot remove a choice from a non-existing quiz')
            return
        }
        set(produce<QuizCreationStore>(state => {
            const question = state.quiz!.questions.find(q => q.choices.some(c => c.id === id))
            if (question) question.choices = question.choices.filter(c => c.id !== id)
        }))
    }
}))

export default useQuizCreationStore

