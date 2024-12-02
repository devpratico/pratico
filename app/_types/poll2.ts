import { Activity } from './activity'
import { produce } from 'immer'
import logger from '../_utils/logger'


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
    activityId: number;
    currentQuestionId: string;
    currentQuestionState: 'answering' | 'results';
    answers: PollUserAnswer[]
}


/**
 * Custom type guard to check if a snapshot is a poll.
 */
export function isPollSnapshot(snapshot: any): snapshot is PollSnapshot {
    return snapshot?.type === 'poll'
}

function uniqueId(prefix: string): string {
    return prefix + Date.now().toString()
}


// FUNCTIONS
// We use curryed functions to create updaters that can be used in a set state function,
// thus modifying the 'prev' state provided by the useState hook.

// All the function below will return an updater like this:
type PollUpdater = (poll: Poll) => Poll // prevPoll => newPoll
type SnapshotUpdater = (snapshot: PollSnapshot) => PollSnapshot // prevSnapshot => newSnapshot


export function addEmptyQuestion(): PollUpdater {
    return (poll: Poll) => {
        const questionId = uniqueId('question-')
        const newQuestion: PollQuestion = { id: questionId, text: '', choices: [] }
        return produce(poll, draft => { draft.questions.push(newQuestion) })
    }
}


export function changeQuestionText({questionId, newText}: {questionId: string, newText: string}): PollUpdater {
    return (poll: Poll) => produce(poll, draft => {
        const questionDraft = draft.questions.find(q => q.id === questionId)
        if (questionDraft) questionDraft.text = newText
    })
}


export function deleteQuestion(questionId: string): PollUpdater {
    return (poll: Poll) => produce(poll, draft => {
        const questionDraft = draft.questions.find(q => q.id === questionId)
        if (questionDraft) draft.questions = draft.questions.filter(q => q !== questionDraft)
    })
}


export function duplicateQuestion(questionId: string): PollUpdater {
    return (poll: Poll) => produce(poll, draft => {
        const questionDraft = draft.questions.find(q => q.id === questionId)
        if (questionDraft) {
            const newQuestion = { ...questionDraft, id: uniqueId('question-') }
            // Get the index of the original question
            const index = draft.questions.findIndex(q => q === questionDraft)
            // Insert the new question after the original one
            draft.questions.splice(index + 1, 0, newQuestion)
        }
    })
}


export function changeQuestionIndex(questionId: string, newIndex: number): PollUpdater {
    return (poll: Poll) => produce(poll, draft => {
        const questionDraft = draft.questions.find(q => q.id === questionId)
        if (questionDraft) {
            // Get the index of the original question
            const currentIndex = draft.questions.findIndex(q => q === questionDraft)
            // Remove the question from its current index
            draft.questions.splice(currentIndex, 1)
            // Insert the question at the new index
            draft.questions.splice(newIndex, 0, questionDraft)
        }
    })
}


export function addEmptyChoice(questionId: string): PollUpdater {
    return (poll: Poll) => produce(poll, draft => {
        const questionDraft = draft.questions.find(q => q.id === questionId)
        if (questionDraft) {
            const choiceId = uniqueId('choice-')
            questionDraft.choices.push({ id: choiceId, text: '' })
        }
    })
}


export function addChoice({questionId, choice}: {questionId: string, choice: Partial<PollChoice>}): PollUpdater {
    // As the choice argument is partial, we need to provide default values for the missing properties
    const defaultEmptyChoice: PollChoice = { id: uniqueId('choice-'), text: '' } // Default values
    const newChoice = { ...defaultEmptyChoice, ...choice } // Change the default values with the provided ones

    return (poll: Poll) => produce(poll, draft => {
        const questionDraft = draft.questions.find(q => q.id === questionId)
        if (questionDraft) questionDraft.choices.push(newChoice)
    })
}


export function changeChoiceText({choiceId, newText}: {choiceId: string, newText: string}): PollUpdater {
    return (poll: Poll) => produce(poll, draft => {
        const choiceDraft = draft.questions.flatMap(q => q.choices).find(c => c.id === choiceId)
        if (choiceDraft) {
            choiceDraft.text = newText
        } else {
            logger.error('typescript:function', 'changeChoiceText', `Choice not found for id: ${choiceId}`)
        }
    })
}


export function deleteChoice(choiceId: string): PollUpdater {
    return (poll: Poll) => produce(poll, draft => {
        const choiceDraft = draft.questions.flatMap(q => q.choices).find(c => c.id === choiceId)
        if (choiceDraft) {
            // Find the question it belongs to
            const questionDraft = draft.questions.find(q => q.choices.includes(choiceDraft))
            // Delete the choice from the question
            if (questionDraft) questionDraft.choices = questionDraft.choices.filter(c => c !== choiceDraft)
        } else {
            logger.error('typescript:function', 'deleteChoice', `Choice not found for id: ${choiceId}`)
        }
    })
}


export function changeChoiceIndex(choiceId: string, newIndex: number): PollUpdater {
    return (poll: Poll) => produce(poll, draft => {
        const choiceDraft = draft.questions.flatMap(q => q.choices).find(c => c.id === choiceId)
        if (choiceDraft) {
            // Find the question it belongs to
            const questionDraft = draft.questions.find(q => q.choices.includes(choiceDraft))
            if (questionDraft) {
                // Get the index of the original choice
                const currentIndex = questionDraft.choices.findIndex(c => c === choiceDraft)
                // Remove the choice from its current index
                questionDraft.choices.splice(currentIndex, 1)
                // Insert the choice at the new index
                questionDraft.choices.splice(newIndex, 0, choiceDraft)
            }
        } else {
            logger.error('typescript:function', 'changeChoiceIndex', `Choice not found for id: ${choiceId}`)
        }
    })
}


export function changeCurrentQuestionId(questionId: string): SnapshotUpdater {
    return (snapshot: PollSnapshot) => produce(snapshot, draft => { draft.currentQuestionId = questionId })
}


export function changeCurrentQuestionState(state: PollSnapshot['currentQuestionState']): SnapshotUpdater {
    return (snapshot: PollSnapshot) => produce(snapshot, draft => { draft.currentQuestionState = state })
}


export function addAnswer(answer: PollUserAnswer): SnapshotUpdater {
    return (snapshot: PollSnapshot) => produce(snapshot, draft => { draft.answers.push(answer) })
}


export function removeAnswer(answerId: string): SnapshotUpdater {
    return (snapshot: PollSnapshot) => produce(snapshot, draft => { draft.answers = draft.answers.filter(a => a.userId !== answerId) })
}


// EXAMPLES

export const emptyPoll: Poll = {
    type: 'poll',
    schemaVersion: '3',
    title: 'Untitled',
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