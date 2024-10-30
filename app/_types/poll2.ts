import { Activity } from './activity'
import { produce, WritableDraft } from 'immer'
import { uniqueId } from 'lodash'
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



// FUNCTIONS

export function addEmptyQuestion(poll: Poll): Poll {
    const questionId = uniqueId('question-')
    const newQuestion: PollQuestion = { id: questionId, text: '', choices: [] }
    return produce(poll, draft => { draft.questions.push(newQuestion)})
}

/** You can identify a question either by its id or its index in the array */
type QuestionIdentifier = { id: string } | { index: number }

interface GetQuestionDraftArgs {
    poll: WritableDraft<Poll>
    question: QuestionIdentifier
}

/** Utility function to find a question by its id or index, inside an immer produce block. */
function getQuestionDraft({ poll, question }: GetQuestionDraftArgs): WritableDraft<PollQuestion> | undefined {
    if ('id' in question) {
        const q = poll.questions.find(q => q.id === question.id)
        if (!q) logger.error('typescript:function', 'getQuestionDraft', `Question not found for id: ${question.id}`)
        return q

    } else { // 'index' in question
        const q = poll.questions[question.index]
        if (!q) logger.error('typescript:function', 'getQuestionDraft', `Question not found for index: ${question.index}`)
        return q
    }
}

export function setQuestionText({ poll, question, text }: { poll: Poll, question: QuestionIdentifier, text: string }): Poll {
    return produce(poll, draft => {
        const questionDraft = getQuestionDraft({ poll: draft, question })
        if (questionDraft) questionDraft.text = text
    })
}

export function deleteQuestion({ poll, question }: { poll: Poll, question: QuestionIdentifier }): Poll {
    return produce(poll, draft => {
        const questionDraft = getQuestionDraft({ poll: draft, question })
        if (questionDraft) draft.questions = draft.questions.filter(q => q !== questionDraft)
    })
}


export function duplicateQuestion({ poll, question }: { poll: Poll, question: QuestionIdentifier }): Poll {
    return produce(poll, draft => {
        const questionDraft = getQuestionDraft({ poll: draft, question })
        if (questionDraft) {
            const newQuestion = { ...questionDraft, id: uniqueId('question-') }
            // Get the index of the original question
            const index = draft.questions.findIndex(q => q === questionDraft)
            // Insert the new question after the original one
            draft.questions.splice(index + 1, 0, newQuestion)
        }
    })
}

export function changeQuestionIndex({ poll, question, newIndex }: { poll: Poll, question: QuestionIdentifier, newIndex: number }): Poll {
    return produce(poll, draft => {
        const questionDraft = getQuestionDraft({ poll: draft, question })
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


export function addEmptyChoice({ poll, question }: { poll: Poll, question: QuestionIdentifier }): Poll {
    return produce(poll, draft => {
        const questionDraft = getQuestionDraft({ poll: draft, question })
        if (questionDraft) {
            const choiceId = uniqueId('choice-')
            questionDraft.choices.push({ id: choiceId, text: '' })
        }
    })
}

export function addChoice({ poll, question, choice }: { poll: Poll, question: QuestionIdentifier, choice: Partial<PollChoice> }): Poll {
    // As the choice argument is partial, we need to provide default values for the missing properties
    const defaultEmptyChoice: PollChoice = { id: uniqueId('choice-'), text: '' } // Default values
    const newChoice = { ...defaultEmptyChoice, ...choice } // Change the default values with the provided ones

    return produce(poll, draft => {
        const questionDraft = getQuestionDraft({ poll: draft, question })
        if (questionDraft) questionDraft.choices.push(newChoice)
    })
}

/** You can identify a choice either by its index - providing the question, or directly by its id */
type ChoiceIdentifier = {
    question: QuestionIdentifier,
    choiceIndex: number
} | { choiceId: string }

interface GetChoiceDraftArgs {
    poll: WritableDraft<Poll>
    choice: ChoiceIdentifier
}

/** Utility function to find a choice by its id, or its index inside a question. Used inside an immer produce block. */
function getChoiceDraft({ poll, choice }: GetChoiceDraftArgs): WritableDraft<PollChoice> | undefined {
    if ('choiceId' in choice) {
        for (const question of poll.questions) {
            const c = question.choices.find(c => c.id === choice.choiceId)
            if (c) return c
        }
        logger.error('typescript:function', 'getChoiceDraft', `Choice not found for id: ${choice.choiceId}`)

    } else { // 'choiceIndex' in choice
        const questionDraft = getQuestionDraft({ poll, question: choice.question })
        if (questionDraft) {
            const c = questionDraft.choices[choice.choiceIndex]
            if (!c) logger.error('typescript:function', 'getChoiceDraft', `Choice not found for index: ${choice.choiceIndex}`)
            return c
        }
    }
}

export function setChoiceText({ poll, choice, text }: { poll: Poll, choice: ChoiceIdentifier, text: string }): Poll {
    return produce(poll, draft => {
        const choiceDraft = getChoiceDraft({ poll: draft, choice })
        if (choiceDraft) choiceDraft.text = text
    })
}

export function deleteChoice({ poll, choice }: { poll: Poll, choice: ChoiceIdentifier }): Poll {
    return produce(poll, draft => {
        const choiceDraft = getChoiceDraft({ poll: draft, choice })
        if (choiceDraft) {
            // Find the question it belongs to
            const questionDraft = draft.questions.find(q => q.choices.includes(choiceDraft))
            // Delete the choice from the question
            if (questionDraft) questionDraft.choices = questionDraft.choices.filter(c => c !== choiceDraft)
        }
    })
}

export function changeChoiceIndex({ poll, choice, newIndex }: { poll: Poll, choice: ChoiceIdentifier, newIndex: number }): Poll {
    return produce(poll, draft => {
        const choiceDraft = getChoiceDraft({ poll: draft, choice })
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
        }
    })
}


export function setSnapshotCurrentQuestionId({ snapshot, questionId }: { snapshot: PollSnapshot, questionId: string }): PollSnapshot {
    return produce(snapshot, draft => { draft.currentQuestionId = questionId })
}

export function setSnapshotCurrentQuestionState({ snapshot, state }: { snapshot: PollSnapshot, state: PollSnapshot['currentQuestionState'] }): PollSnapshot {
    return produce(snapshot, draft => { draft.currentQuestionState = state })
}

export function addAnswer({ snapshot, answer }: { snapshot: PollSnapshot, answer: PollUserAnswer }): PollSnapshot {
    return produce(snapshot, draft => { draft.answers.push(answer) })
}

export function removeAnswer({ snapshot, answerId }: { snapshot: PollSnapshot, answerId: string }): PollSnapshot {
    return produce(snapshot, draft => { draft.answers = draft.answers.filter(a => a.userId !== answerId) })
}


// EXAMPLES

export const emptyPoll: Poll = {
    type: 'poll',
    schemaVersion: '3',
    title: 'Untitled',
    questions: [],
}

export const mockPoll: Poll = {
    type: 'poll',
    schemaVersion: '3',
    title: 'Mock poll',
    questions: [
        {
            id: 'question-1',
            text: 'What is your favorite color?',
            choices: [
                { id: 'choice-1', text: 'Red' },
                { id: 'choice-2', text: 'Green' },
                { id: 'choice-3', text: 'Blue' },
            ]
        },
        {
            id: 'question-2',
            text: 'What is your favorite animal?',
            choices: [
                { id: 'choice-4', text: 'Dog' },
                { id: 'choice-5', text: 'Cat' },
                { id: 'choice-6', text: 'Bird' },
            ]
        }
    ]
}