import { Activity } from './activity'


export interface QuizChoice {
    text: string
    /**
     * 'A' for 'Answer A', or an emoji, etc.
     */
    symbol?: string
    color?: string
    isCorrect: boolean
    explanation?: string
}

export interface QuizQuestion {
    text: string
    photoUrl?: string
    choicesIds: string[]
    hint?: string
    canChooseMultiple?: boolean
}


export interface Quiz extends Activity {
    type: 'quiz'
    schemaVersion: '2'
    questions: { [questionId: string]: QuizQuestion }
    choices: { [choiceId: string]: QuizChoice }
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
    currentQuestionIndex: number;
    currentQuestionState: 'answering' | 'results';
    answers: { [answerId: string]: QuizUserAnswer }
}

/**
 * Custom type guard to check if a snapshot is a poll.
 */
export function isQuizSnapshot(snapshot: any): snapshot is QuizSnapshot {
    return snapshot?.type === 'quiz'
}