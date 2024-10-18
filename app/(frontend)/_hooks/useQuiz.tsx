'use client'
import { useState, useContext, createContext, useEffect } from "react"
import { produce } from 'immer'
import { Quiz, QuizChoice } from "@/app/_types/quiz"
import { set } from "lodash"


type QuizContextType = {
    quiz: Quiz
    setTitle: (title: string) => void
    addEmptyQuestion: () => { questionId: string }
    setQuestionText: (questionId: string, text: string) => void
    deleteQuestion: (questionId: string) => void
    addEmptyChoice: (questionId: string) => { choiceId: string }
    addChoice: (questionId: string, choice: QuizChoice) => void
    setChoiceText: (choiceId: string, text: string) => void
    setChoiceIsCorrect: (choiceId: string, isCorrect: boolean) => void
    deleteChoice: (choiceId: string) => void
	duplicateQuestion: (copiedQuestionId: string) => {questionId: string}
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children, quiz }: { children: React.ReactNode, quiz: Quiz }) {
    const [quizState, setQuizState] = useState<Quiz>(quiz)


    const setTitle = (title: string) => {
        setQuizState(prevState => produce(prevState, draft => {draft.title = title}))
    }

    const addEmptyQuestion = () => {
        const questionId = `${Object.keys(quizState.questions).length + 1}`
        setQuizState(prevState => produce(prevState, draft => {
            draft.questions[questionId] = {text: '', choicesIds: []}
        }))
        return { questionId }
    }

    const setQuestionText = (questionId: string, text: string) => {
        setQuizState(prevState => produce(prevState, draft => {
            draft.questions[questionId].text = text
        }))
    }

    const addEmptyChoice = (questionId: string) => {
        const choiceId = `${Object.keys(quizState.choices).length + 1}`
        setQuizState(prevState => produce(prevState, draft => {
            draft.choices[choiceId] = { text: '', isCorrect: false }
            draft.questions[questionId].choicesIds.push(choiceId)
        }))
        return { choiceId }
    }

    const addChoice = (questionId: string, choice: QuizChoice) => {
        const choiceId = `${Object.keys(quizState.choices).length + 1}`
        setQuizState(produce(quizState, draft => {
            draft.choices[choiceId] = choice
            draft.questions[questionId].choicesIds.push(choiceId)
        }))
    }

    const setChoiceText = (choiceId: string, text: string) => {
        setQuizState(prevState => produce(prevState, draft => {
            draft.choices[choiceId].text = text
        }))
    }

    const setChoiceIsCorrect = (choiceId: string, isCorrect: boolean) => {
        setQuizState(prevState => produce(prevState, draft => {
            draft.choices[choiceId].isCorrect = isCorrect
        }))
    }

    const deleteQuestion = (questionId: string) => {
        // Delete the question itself
        setQuizState(prevState => produce(prevState, draft => {
            delete draft.questions[questionId]
        }))

        // Delete all choices that belong to the question
        Object.entries(quizState.choices).forEach(([choiceId, choice]) => {
            if (quizState.questions[questionId].choicesIds.includes(choiceId)) {
                deleteChoice(choiceId)
            }
        })
    }

	const duplicateQuestion = (copiedQuestionId: string) => {
		const questionId = `${Object.keys(quizState.questions).length + 1}`;
		const choicesLength = quizState.questions[copiedQuestionId].choicesIds.length;
		const newChoicesIds = quizState.questions[copiedQuestionId].choicesIds.map((item, index) => `${choicesLength + index + 1}`);
		
		const copiedQuestion = {
			text: structuredClone(quizState.questions[copiedQuestionId].text),
			choicesIds: newChoicesIds
		}
        setQuizState(prevState => produce(prevState, draft => {
            draft.questions[questionId] = copiedQuestion;
			copiedQuestion.choicesIds.forEach((newChoiceId, index) => {
				if (quizState.questions[copiedQuestionId].choicesIds[index])
				{
					const originalChoiceId = quizState.questions[copiedQuestionId].choicesIds[index];
					draft.choices[newChoiceId] = structuredClone(quizState.choices[originalChoiceId]);
				}
			  });
        }))
		return ({questionId});
    }


    const deleteChoice = (choiceId: string) => {
        setQuizState(prevState => produce(prevState, draft => {
            // Delete the choice itself
            delete draft.choices[choiceId]

            // Remove the choice from all questions that reference it
            Object.entries(draft.questions).forEach(([questionId, question]) => {
                draft.questions[questionId].choicesIds = question.choicesIds.filter(id => id !== choiceId)
            })
        }))
    }



    return (
        <QuizContext.Provider value={{
            quiz: quizState,
            setTitle,
            addEmptyQuestion,
            setQuestionText,
            addEmptyChoice,
            addChoice,
            setChoiceText,
            setChoiceIsCorrect,
            deleteQuestion,
            deleteChoice,
			duplicateQuestion
        }}>
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


export const testQuiz: Quiz = {
    type: 'quiz',
    schemaVersion: '2',
    title: 'Mon super quiz',
    questions: {
        '1': {
            text: 'Quelle est la capitale de la France ?',
            choicesIds: ['1', '2', '3']
        },
        '2': {
            text: 'Quelle est la capitale de l\'Espagne ?',
            choicesIds: ['4', '5', '6']
        }
    },
    choices: {
        '1': {
            text: 'Paris',
            isCorrect: true
        },
        '2': {
            text: 'Londres',
            isCorrect: false
        },
        '3': {
            text: 'Berlin',
            isCorrect: false
        },
        '4': {
            text: 'Madrid',
            isCorrect: true
        },
        '5': {
            text: 'Londres',
            isCorrect: false
        },
        '6': {
            text: 'Berlin',
            isCorrect: false
        }
    }
}

export const emptyQuiz: Quiz = {
    type: 'quiz',
    schemaVersion: '2',
    title: '',
    questions: {
        '1': {
            text: '',
            choicesIds: []
        }
    },
    choices: {}
}