import { Activity } from './activity'


// TYPES

/**
 * What you can answer to a poll question. Example: "Yes" or "No"
 */
export interface PollChoice {
    id: string
    text: string
    symbol?: string
    color?: string
}


/**
 * A question in a poll. Example: "What is your favorite color?"
 */
export interface PollQuestion {
    id: string
    text: string
    photoUrl?: string
    choices: PollChoice[]
}


/**
 * A poll activity. (It doesn't contain the users answers).
 */
export interface Poll extends Activity {
    type: 'poll'
    schemaVersion: '3'
    questions: PollQuestion[]
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
 * The current state of a poll activity. It contains the user answers.
 */
export interface PollSnapshot {
    type: 'poll';
    /**
     * The id of the poll in the supabase database.
     */
    activityId: string | number;
    currentQuestionId: string;
    state: 'voting' | 'showing results',
    answers: PollUserAnswer[]
}


/**
 * Custom type guard to check if a snapshot is a poll.
 */
export function isPollSnapshot(snapshot: any): snapshot is PollSnapshot {
    return snapshot?.type === 'poll'
}


// EXAMPLES

export const emptyPoll: Poll = {
    type: 'poll',
    schemaVersion: '3',
    title: 'Sans titre',
    questions: [
        {
            id: 'question-01',
            text: '',
            choices: []
        },
    ],
}

export const mockPoll: Poll = {
    type: 'poll',
    schemaVersion: '3',
    title: 'Mock poll',
    questions: [
        {
            id: 'question-01',
            text: 'What is your favorite color?',
            choices: [
                { id: 'choice-01', text: 'Red' },
                { id: 'choice-02', text: 'Green' },
                { id: 'choice-03', text: 'Blue' },
            ]
        },
        {
            id: 'question-02',
            text: 'What is your favorite animal?',
            choices: [
                { id: 'choice-04', text: 'Dog' },
                { id: 'choice-05', text: 'Cat' },
                { id: 'choice-06', text: 'Bird' },
            ]
        }
    ]
}