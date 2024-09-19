'use client'
import { useState, useContext, createContext } from "react"
import { produce } from 'immer'
import { Poll } from "@/app/_types/poll"
import { randomUUID } from "crypto"


type PollContextType = {
    poll: Poll
    setTitle: (title: string) => void
    addEmptyQuestion: () => { questionId: string }
    setQuestionText: (questionId: string, text: string) => void
    addEmptyChoice: (questionId: string) => { choiceId: string }
    setChoiceText: (choiceId: string, text: string) => void
    deleteChoice: (choiceId: string) => void
    deleteQuestion: (questionId: string) => void
}

const PollContext = createContext<PollContextType | undefined>(undefined)

export function PollProvider({ children, poll }: { children: React.ReactNode, poll: Poll }) {
    const [pollState, setPollState] = useState<Poll>(poll)

    const setTitle = (title: string) => {
        setPollState(produce(pollState, draft => {draft.title = title}))
    }

    const addEmptyQuestion = () => {
        const questionId = randomUUID()
        setPollState(produce(pollState, draft => {
            draft.questions[questionId] = {text: '', choicesIds: []}
        }))
        return { questionId }
    }

    const setQuestionText = (questionId: string, text: string) => {
        setPollState(produce(pollState, draft => {
            draft.questions[questionId].text = text
        }))
    }

    const addEmptyChoice = (questionId: string) => {
        const choiceId = randomUUID()
        setPollState(produce(pollState, draft => {
            draft.choices[choiceId] = { text: ''}
            draft.questions[questionId].choicesIds.push(choiceId)
        }))
        return { choiceId }
    }

    const setChoiceText = (choiceId: string, text: string) => {
        setPollState(produce(pollState, draft => {
            draft.choices[choiceId].text = text
        }))
    }

    const deleteChoice = (choiceId: string) => {
        // Delete the choice itself
        setPollState(produce(pollState, draft => {
            delete draft.choices[choiceId]
        }))

        // Delete the choiceId from all questions that reference it
        setPollState(produce(pollState, draft => {
            for (const questionId in draft.questions) {
                draft.questions[questionId].choicesIds = draft.questions[questionId].choicesIds.filter(id => id !== choiceId)
            }
        }))
    }

    const deleteQuestion = (questionId: string) => {
        // Delete the question itself
        setPollState(produce(pollState, draft => {
            delete draft.questions[questionId]
        }))

        // Delete all choices that are referenced by this question
        setPollState(produce(pollState, draft => {
            for (const choiceId of draft.questions[questionId].choicesIds) {
                delete draft.choices[choiceId]
            }
        }))
    }

    return (
        <PollContext.Provider value={{ poll: pollState, setTitle, addEmptyQuestion, setQuestionText, addEmptyChoice, setChoiceText, deleteChoice, deleteQuestion }}>
            {children}
        </PollContext.Provider>
    )
}

export function usePoll() {
    const context = useContext(PollContext)
    if (!context) {
        throw new Error('usePoll must be used within a PollProvider')
    }
    return context
}


export const emptyPoll: Poll = {
    type: 'poll',
    schemaVersion: '2',
    title: '',
    questions: {},
    choices: {}
}

export const testPoll: Poll = {
    type: 'poll',
    schemaVersion: '2',
    title: 'Test Poll',
    questions: {
        '1': {
            text: 'What is the best color?',
            choicesIds: ['1', '2', '3']
        },
        '2': {
            text: 'What is the best animal?',
            choicesIds: ['4', '5', '6']
        }
    },
    choices: {
        '1': { text: 'Red' },
        '2': { text: 'Green' },
        '3': { text: 'Blue' }
    }
}