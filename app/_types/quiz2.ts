import { Activity } from './activity'


export interface QuizChoice {
    id: string
    text: string
    /**
     * 'A' for 'Answer A', or an emoji, etc.
     */
    symbol?: string
    color?: string
    isCorrect: boolean
    explanation?: string
}


// test

export interface QuizQuestion {
    id: string
    text: string
    photoUrl?: string
    hint?: string
    canChooseMultiple?: boolean
    choices: QuizChoice[]
}


export interface Quiz extends Activity {
    type: 'quiz'
    schemaVersion: '3'
    questions: QuizQuestion[]
}

/**
 * A user answer to a quiz question.
 */
export interface QuizUserAnswer {
    userId: string
    timestamp: number
    questionId: string
    choiceId: string
}

export interface QuizSnapshot {
    type:'quiz';
    activityId: number;
    currentQuestionId: string;
    currentQuestionState: 'answering' | 'showing results';
    answers: QuizUserAnswer[]
}

/**
 * Custom type guard to check if a snapshot is a poll.
 */
export function isQuizSnapshot(snapshot: any): snapshot is QuizSnapshot {
    return snapshot?.type === 'quiz'
}


// EXAMPLES

export const emptyQuiz: Quiz = {
    type: 'quiz',
    schemaVersion: '3',
    title: 'Untitled',
    questions: [
        {
            id: 'question-0',
            text: '',
            choices: []
        }
    ]
}


export const mockQuiz: Quiz = {
    type: 'quiz',
    schemaVersion: '3',
    title: 'Mock Quiz',
    questions: [
        {
            id: 'question-0',
            text: 'What is the capital of France?',
            choices: [
                {
                    id: 'choice-0',
                    text: 'Paris',
                    isCorrect: true
                },
                {
                    id: 'choice-1',
                    text: 'London',
                    isCorrect: false
                },
                {
                    id: 'choice-2',
                    text: 'Berlin',
                    isCorrect: false
                }
            ]
        },
        {
            id: 'question-1',
            text: 'What is the capital of Germany?',
            choices: [
                {
                    id: 'choice-3',
                    text: 'Paris',
                    isCorrect: false
                },
                {
                    id: 'choice-4',
                    text: 'London',
                    isCorrect: false
                },
                {
                    id: 'choice-5',
                    text: 'Berlin',
                    isCorrect: true
                }
            ]
        }
    ]
}