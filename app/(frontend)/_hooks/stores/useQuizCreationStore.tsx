import { Quiz } from "@/app/_types/quiz"
import { create } from "zustand"
import { current, produce } from "immer"
import logger from "@/app/_utils/logger"
import { emptyQuiz } from "@/app/_types/quiz"
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
    setShowQuizCreation: (show?: boolean) => void
    setActivityId: (id: Id) => void
    removeQuiz: () => void
    setTitle: (title: string) => void
    setCurrentQuestion: (arg: { id: string } | { index: number }) => void
    addEmptyQuestion: () => void
    setQuestionText: (arg: { id: string, text: string }) => void
    removeQuestion: (id: string) => void
    duplicateQuestion: (id: string) => void
    addChoice: (text: string) => void
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
            currentQuestionId: emptyQuiz.questions[0].id
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

    setShowQuizCreation: (show = true) => {
        set({ showQuizCreation: show })
    },

    setActivityId: (id) => {
        set({ activityId: id })
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
        if (!(get().quiz)) {
            logger.error('zustand:action', 'Cannot remove a question from a non-existing quiz')
            return
        }

        // If there is only one question left, don't delete
        if (get().quiz!.questions.length === 1) {
            logger.error('zustand:action', 'Cannot remove the last question from a quiz')
            return
        }

        set(produce<QuizCreationStore>(state => {
            
            // Store the current index, we'll need it later
            const deletedQuestionIndex = state.quiz!.questions.findIndex(q => q.id === id)
            
            // Remove the question
            state.quiz!.questions = state.quiz!.questions.filter(q => q.id !== id)

            // We have probably removed the current question. If so, currentQuestionId is now invalid.
            if (state.currentQuestionId == id) {
                // We should set the currentQuestionId to an existing question.
                // Let's choose the question that now sits at the same index as the removed question.
                let newIndex = deletedQuestionIndex
                // There's a chance that the removed question was the last one.
                // In that case, there is no question anymore at that index.
                if (newIndex >= state.quiz!.questions.length) {
                    // In that case, we'll set the index to the last question.
                    newIndex = state.quiz!.questions.length - 1
                }
                // Set the new currentQuestionId
                state.currentQuestionId = state.quiz!.questions[newIndex].id
            }
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
                // Duplicate the choices, and change all of their ids
                const newChoices = question.choices.map(choice => ({ ...choice, id: uniqueTimestampId('choice-') }))
                
                const newQuestion = { ...question, id: newQuestionId, choices: newChoices }

                const index = state.quiz!.questions.findIndex(q => q.id === id)
                state.quiz!.questions.splice(index + 1, 0, newQuestion)
                state.currentQuestionId = newQuestionId
            }
        }))
    },

    addChoice: (text) => {
        if (!get().quiz) {
            logger.error('zustand:action', 'Cannot add a choice to a non-existing quiz')
            return
        }
        set(produce<QuizCreationStore>(state => {
            const question = state.quiz!.questions.find(q => q.id === state.currentQuestionId)
            if (question) question.choices.push({
                id: uniqueTimestampId('choice-'),
                text: text,
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

