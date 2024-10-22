'use client'
import { useState, useContext, createContext } from "react"
import { produce } from 'immer'
import { Poll, PollChoice } from "@/app/_types/poll"


type PollContextType = {
    poll: Poll
    setTitle: (title: string) => void
    addEmptyQuestion: () => { questionId: string }
    setQuestionText: (questionId: string, text: string) => void
    addEmptyChoice: (questionId: string) => { choiceId: string }
    addChoice: (questionId: string, choice: PollChoice) => void
    setChoiceText: (choiceId: string, text: string) => void
    deleteChoice: (choiceId: string) => void
    deleteQuestion: (questionId: string) => void
	duplicateQuestion: (copiedQuestionId: string) => {questionId: string}
}

const PollContext = createContext<PollContextType | undefined>(undefined)

export function PollProvider({ children, poll }: { children: React.ReactNode, poll: Poll }) {
    const [pollState, setPollState] = useState<Poll>(poll)

    const setTitle = (title: string) => {
        setPollState(produce(pollState, draft => {draft.title = title}))
    }

    const addEmptyQuestion = () => {
        const questionId = `${Object.keys(pollState.questions).length + 1}`
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
        const choiceId = `${Object.keys(pollState.choices).length + 1}`
        setPollState(produce(pollState, draft => {
            draft.choices[choiceId] = { text: ''}
            draft.questions[questionId].choicesIds.push(choiceId)
        }))
        return { choiceId }
    }

    const addChoice = (questionId: string, choice: PollChoice) => {
        const choiceId = `${Object.keys(pollState.choices).length + 1}`
        setPollState(produce(pollState, draft => {
            draft.choices[choiceId] = choice
            draft.questions[questionId].choicesIds.push(choiceId)
        }))
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
		if (Object.keys(pollState.questions).length > 1)
		{
			// Delete the question itself
			setPollState(prevState => produce(prevState, draft => {
				delete draft.questions[questionId]
			}))
		}
		else
		{
			setPollState(prevState => produce(prevState, draft => {
				draft.questions[questionId].text = "";
			}))
		}
        // Delete all choices that belong to the question
        Object.entries(pollState.choices).forEach(([choiceId, choice]) => {
            if (pollState.questions[questionId].choicesIds.includes(choiceId)) {
                deleteChoice(choiceId)
            }
        })
    }

	const duplicateQuestion = (copiedQuestionId: string) => {
		const questionId = `${Object.keys(pollState.questions).length + 1}`;
		const choicesLength = pollState.questions[copiedQuestionId].choicesIds.length;
		const newChoicesIds = pollState.questions[copiedQuestionId].choicesIds.map((item, index) => `${choicesLength + index + 1}`);
		
		const copiedQuestion = {
			text: structuredClone(pollState.questions[copiedQuestionId].text),
			choicesIds: newChoicesIds
		}
        setPollState(prevState => produce(prevState, draft => {
			draft.questions[questionId] = copiedQuestion;
			if (copiedQuestion.choicesIds.length)
			{
				copiedQuestion.choicesIds.forEach((newChoiceId, index) => {
					if (pollState.questions[copiedQuestionId].choicesIds[index]) {
						const originalChoiceId = pollState.questions[copiedQuestionId].choicesIds[index];
						draft.choices[newChoiceId] = structuredClone(pollState.choices[originalChoiceId]);
					}
				});	
			}
        }))
		return ({questionId});
    }

    return (
        <PollContext.Provider value={{ poll: pollState, setTitle, addEmptyQuestion, setQuestionText, addEmptyChoice, addChoice, setChoiceText, deleteChoice, deleteQuestion, duplicateQuestion }}>
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
    title: 'Sans titre',
    questions: {
        '1': {
            text: '',
            choicesIds: []
        }
    },
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