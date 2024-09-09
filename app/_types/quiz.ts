import { Activity } from './activity'


export interface QuizAnswer {
    text: string
    /**
     * 'A' for 'Answer A', or an emoji, etc.
     */
    symbol: string
    color?: string
    correct: boolean
    explanation?: string
}

export interface QuizQuestion {
    text: string
    photoUrl?: string
    answers: QuizAnswer[]
    hint?: string
}


export interface Quiz extends Activity {
    type: 'quiz'
    schemaVersion: '1'
    questions: QuizQuestion[]
}

export interface QuizSnapshot {
    type:'quiz';
    activityId: number;
    currentQuestionIndex: number;
    currentQuestionState: 'answering' | 'results';
    // TODO: Add the users answers
}