import { Activity } from './activity'


export interface PollAnswer {
    text: string
    /**
     * 'A' for 'Answer A', or an emoji, etc.
     */
    symbol: string
    color?: string
}

export interface PollQuestion {
    text: string
    photoUrl?: string
    answers: PollAnswer[]
}


export interface Poll extends Activity {
    type: 'poll'
    schemaVersion: '1'
    questions: PollQuestion[]
}


export interface PollSnapshot {
    activityId: number;
    currentQuestionIndex: number;
    currentQuestionState: 'answering' | 'results';
    votes: number[]
}