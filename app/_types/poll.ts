import { Activity } from './activity'


/**
 * What you can answer to a poll question. Example: "Yes" or "No"
 */
export interface PollChoice {
    text: string
    symbol?: string
    color?: string
}


/**
 * A question in a poll. Example: "What is your favorite color?"
 */
export interface PollQuestion {
    text: string
    photoUrl?: string
    choicesIds: string[]
}


/**
 * A poll activity. It doesn't contain the user answers.
 */
export interface Poll extends Activity {
    type: 'poll'
    schemaVersion: '2'
    questions: { [questionId: string]: PollQuestion }
    choices: { [choiceId: string]: PollChoice }
}


/**
 * A user answer to a poll question.
 */
export interface PollUserAnswer {
    userId: string
    timestamp: number
    questionId: string
    choiceId: string
}


/**
 * The current state of a poll activity.
 */
export interface PollSnapshot {
    type:'poll';
    /**
     * The id of the poll in the supabase database.
     */
    activityId: number;
    currentQuestionId: string;
    currentQuestionState: 'answering' | 'results';
    answers: { [answerId: string]: PollUserAnswer }
}


/**
 * Custom type guard to check if a snapshot is a poll.
 */
export function isPollSnapshot(snapshot: any): snapshot is PollSnapshot {
    return snapshot?.type === 'poll'
}