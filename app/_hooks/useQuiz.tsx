'use client'
import { useState, useContext, createContext } from "react"
import { produce } from 'immer'
import { Quiz } from "@/app/_types/quiz"
import { randomUUID } from "crypto"


type QuizContextType = {
    quiz: Quiz
    setTitle: (title: string) => void
    addEmptyQuestion: () => { questionId: string }
    setQuestionText: (questionId: string, text: string) => void
    addEmptyChoice: (questionId: string) => { choiceId: string }
    setChoiceText: (choiceId: string, text: string) => void
    setChoiceIsCorrect: (choiceId: string, isCorrect: boolean) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children, quiz }: { children: React.ReactNode, quiz: Quiz }) {
    const [quizState, setQuizState] = useState<Quiz>(quiz)

    const setTitle = (title: string) => {
        setQuizState(produce(quizState, draft => {draft.title = title}))
    }

    const addEmptyQuestion = () => {
        const questionId = randomUUID()
        setQuizState(produce(quizState, draft => {
            draft.questions[questionId] = {text: '', choicesIds: []}
        }))
        return { questionId }
    }

    const setQuestionText = (questionId: string, text: string) => {
        setQuizState(produce(quizState, draft => {
            draft.questions[questionId].text = text
        }))
    }

    const addEmptyChoice = (questionId: string) => {
        const choiceId = randomUUID()
        setQuizState(produce(quizState, draft => {
            draft.choices[choiceId] = { text: '', isCorrect: false }
            draft.questions[questionId].choicesIds.push(choiceId)
        }))
        return { choiceId }
    }

    const setChoiceText = (choiceId: string, text: string) => {
        setQuizState(produce(quizState, draft => {
            draft.choices[choiceId].text = text
        }))
    }

    const setChoiceIsCorrect = (choiceId: string, isCorrect: boolean) => {
        setQuizState(produce(quizState, draft => {
            draft.choices[choiceId].isCorrect = isCorrect
        }))
    }

    return (
        <QuizContext.Provider value={{ quiz: quizState, setTitle, addEmptyQuestion, setQuestionText, addEmptyChoice, setChoiceText, setChoiceIsCorrect }}>
            {children}
        </QuizContext.Provider>
    )
}

export function useQuiz() {
    const context = useContext(QuizContext)
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider')
    }
    return context
}