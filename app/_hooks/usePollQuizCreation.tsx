'use client'
import { useState, useContext, createContext } from "react"
import { produce } from 'immer'


// BASE TYPES
// Used by both Polls and Quizzes
// May be used in the future for other types of activities.

export type ActivityType = 'quiz' | 'poll'

export interface Activity {
    type: ActivityType
    title: string
    schemaVersion: string
}


export interface BaseQuestion {
    text: string
    photoUrl?: string
}

export interface BaseAnswer {
    text: string
    /**
     * 'A' for 'Answer A', or an emoji, etc.
     */
    symbol: string
}



// POLL TYPES
// Polls are just questions with possible answers. There is no right or wrong answer.

export interface PollAnswer extends BaseAnswer {
    color: string
}

export interface PollQuestion {
    question: BaseQuestion
    answers: PollAnswer[]
}


export interface Poll extends Activity {
    type: 'poll'
    schemaVersion: '1'
    questions: PollQuestion[]
}



// QUIZ TYPES
// Quizzes are questions with possible answers, but only one or more answers are correct.

export interface QuizAnswer extends BaseAnswer {
    correct: boolean
    explanation?: string
}

export interface QuizQuestion {
    question: BaseQuestion
    answers: QuizAnswer[]
    hint?: string
}

export interface Quiz extends Activity {
    type: 'quiz'
    schemaVersion: '1'
    questions: QuizQuestion[]
}




/**
 * Methods and properties that are common to both polls and quizzes,
 * that will be used in the hooks.
 */
type QuizPollCommonContextType = {

    /**
     * While creating an activity, we need to know which id to save to in Supabase.
     * If undefined, we're creating a new activity.
     */
    idToSaveTo?: number

    /**
     * This is the index of the current question being displayed and edited.
     * (We typically display one question at a time during quiz creation.
     */
    currentQuestionIndex: number

    /**
     * Sets the index of the current question being edited.
     * (We typically display one question at a time during quiz creation.)
     */
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
    setTitle: (title: string) => void
    setQuestionText: ({ questionIndex, text }: { questionIndex: number, text: string }) => void
    setAnswerText: ({ questionIndex, answerIndex, text }: { questionIndex: number, answerIndex: number, text: string }) => void
    setAnswerSymbol: ({ questionIndex, answerIndex, symbol }: { questionIndex: number, answerIndex: number, symbol: string }) => void
    deleteAnswer: ({ questionIndex, answerIndex }: { questionIndex: number, answerIndex: number }) => void
    deleteQuestion: (index: number) => void
    addEmptyQuestion: () => void
}

/**
 * Methods and properties that are specific to polls
 */
type PollExtraContextType = {
    poll: Poll
    setPoll: (poll: Poll) => void
    addNewAnswer: ({ questionIndex, answer }: { questionIndex: number, answer: Partial<PollAnswer> }) => void
    setAnswerColor: ({ questionIndex, answerIndex, color }: { questionIndex: number, answerIndex: number, color: string }) => void
}

/**
 * Methods and properties that are specific to quizzes
 */
type QuizExtraContextType = {
    quiz: Quiz
    setQuiz: (quiz: Quiz) => void
    addNewAnswer: ({ questionIndex, answer }: { questionIndex: number, answer: Partial<QuizAnswer> }) => void
    setAnswerCorrect: ({ questionIndex, answerIndex, correct }: { questionIndex: number, answerIndex: number, correct: boolean }) => void
    setAnswerExplanation: ({ questionIndex, answerIndex, explanation }: { questionIndex: number, answerIndex: number, explanation: string }) => void
    setHint: ({ questionIndex, hint }: { questionIndex: number, hint: string }) => void
}


type PollCreationContextType = QuizPollCommonContextType & PollExtraContextType
type QuizCreationContextType = QuizPollCommonContextType & QuizExtraContextType







// Let's implement the common methods used by both polls and quizzes.

function _setTitle<T extends Quiz | Poll>({ title, setQuizPoll }: { title: string, setQuizPoll: React.Dispatch<React.SetStateAction<T>> }) {
    setQuizPoll((prev) => produce(prev, draft => { draft.title = title }));
}

function _setQuestionText<T extends Quiz | Poll>({ questionIndex, text, setQuizPoll }: { questionIndex: number, text: string, setQuizPoll: React.Dispatch<React.SetStateAction<T>> }) {
    setQuizPoll((prev) => produce(prev, draft => { draft.questions[questionIndex].question.text = text }));
}

function _setAnswerText<T extends Quiz | Poll>({ questionIndex, answerIndex, text, setQuizPoll }: { questionIndex: number, answerIndex: number, text: string, setQuizPoll: React.Dispatch<React.SetStateAction<T>> }) {
    setQuizPoll((prev) => produce(prev, draft => { draft.questions[questionIndex].answers[answerIndex].text = text }));
}

function _setAnswerSymbol<T extends Quiz | Poll>({ questionIndex, answerIndex, symbol, setQuizPoll }: { questionIndex: number, answerIndex: number, symbol: string, setQuizPoll: React.Dispatch<React.SetStateAction<T>> }) {
    setQuizPoll((prev) => produce(prev, draft => { draft.questions[questionIndex].answers[answerIndex].symbol = symbol }));
}

function _deleteAnswer<T extends Quiz | Poll>({ questionIndex, answerIndex, setQuizPoll }: { questionIndex: number, answerIndex: number, setQuizPoll: React.Dispatch<React.SetStateAction<T>> }) {
    setQuizPoll((prev) => produce(prev, draft => { draft.questions[questionIndex].answers.splice(answerIndex, 1) }));
}

function _deleteQuestion<T extends Quiz | Poll>({ questionIndex, currentQuestionIndex, quizPoll, setQuizPoll, setCurrentQuestionIndex }: { questionIndex: number, currentQuestionIndex: number, quizPoll: T, setQuizPoll: React.Dispatch<React.SetStateAction<T>>, setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>> }) {
    // No need to change currentQuestionIndex, except if we're deleting the last question.
    if (currentQuestionIndex === quizPoll.questions.length - 1) {
        setCurrentQuestionIndex(questionIndex - 1); // Move to the previous question
    }
    setQuizPoll((prev) => produce(prev, draft => { draft.questions.splice(questionIndex, 1) }));
}

function _addEmptyQuestion<T extends Quiz | Poll>({ setQuizPoll }: { setQuizPoll: React.Dispatch<React.SetStateAction<T>>}) {
    setQuizPoll((prev) => produce(prev, draft => { draft.questions.push({ question: { text: '' }, answers: [] }) }));
}




// Poll creation hook


const PollCreationContext = createContext<PollCreationContextType | undefined>(undefined);

export function PollCreationProvider({ initialPoll, idToSaveTo, children }: { initialPoll: Poll, idToSaveTo?: number, children: React.ReactNode }) {
    const [poll, setPoll] = useState<Poll>(initialPoll);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    function setTitle(title: string) {
        _setTitle({ title, setQuizPoll: setPoll });
    }
    
    function setQuestionText({ questionIndex, text }: { questionIndex: number, text: string }) {
        _setQuestionText({ questionIndex, text, setQuizPoll: setPoll });
    }

    function setAnswerText({ questionIndex, answerIndex, text }: { questionIndex: number, answerIndex: number, text: string }) {
        _setAnswerText({ questionIndex, answerIndex, text, setQuizPoll: setPoll });
    }

    function setAnswerSymbol({ questionIndex, answerIndex, symbol }: { questionIndex: number, answerIndex: number, symbol: string }) {
        _setAnswerSymbol({ questionIndex, answerIndex, symbol, setQuizPoll: setPoll });
    }

    function deleteAnswer({ questionIndex, answerIndex }: { questionIndex: number, answerIndex: number }) {
        _deleteAnswer({ questionIndex, answerIndex, setQuizPoll: setPoll });
    }

    function deleteQuestion(index: number) {
        _deleteQuestion({ questionIndex: index, currentQuestionIndex, quizPoll: poll, setQuizPoll: setPoll, setCurrentQuestionIndex });
    }

    function addEmptyQuestion() {
        _addEmptyQuestion({ setQuizPoll: setPoll });
    }

    function addNewAnswer({ questionIndex, answer }: { questionIndex: number, answer: Partial<PollAnswer> }) {
        const symbol = poll.questions.length.toString();
        const _answer: PollAnswer = { text: '', symbol:symbol, color: '', ...answer }
        setPoll((prev) => produce(prev, draft => { draft.questions[questionIndex].answers.push(_answer)}));
    }

    function setAnswerColor({ questionIndex, answerIndex, color }: { questionIndex: number, answerIndex: number, color: string }) {
        setPoll((prev) => produce(prev, draft => { draft.questions[questionIndex].answers[answerIndex].color = color}));
    }


    return (
        <PollCreationContext.Provider value={{
            poll,
            setPoll,
            idToSaveTo,
            setTitle,
            currentQuestionIndex,
            setCurrentQuestionIndex,
            setQuestionText,
            setAnswerText,
            setAnswerSymbol,
            deleteAnswer,
            deleteQuestion,
            addEmptyQuestion,
            addNewAnswer,
            setAnswerColor,
        }}>
            {children}
        </PollCreationContext.Provider>
    );
}


export function usePollCreation() {
    const context = useContext(PollCreationContext);
    if (!context) throw new Error('usePollCreation must be used within a PollCreationProvider');
    return context;
}




// Quiz creation hook

const QuizCreationContext = createContext<QuizCreationContextType | undefined>(undefined);

export function QuizCreationProvider({ initialQuiz, idToSaveTo, children }: { initialQuiz: Quiz, idToSaveTo?: number, children: React.ReactNode }) {
    const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


    function setTitle(title: string) {
        _setTitle({ title, setQuizPoll: setQuiz });
    }

    function setQuestionText({ questionIndex, text }: { questionIndex: number, text: string }) {
        _setQuestionText({ questionIndex, text, setQuizPoll: setQuiz });
    }

    function setAnswerText({ questionIndex, answerIndex, text }: { questionIndex: number, answerIndex: number, text: string }) {
        _setAnswerText({ questionIndex, answerIndex, text, setQuizPoll: setQuiz });
    }

    function setAnswerSymbol({ questionIndex, answerIndex, symbol }: { questionIndex: number, answerIndex: number, symbol: string }) {
        _setAnswerSymbol({ questionIndex, answerIndex, symbol, setQuizPoll: setQuiz });
    }

    function deleteAnswer({ questionIndex, answerIndex }: { questionIndex: number, answerIndex: number }) {
        _deleteAnswer({ questionIndex, answerIndex, setQuizPoll: setQuiz });
    }

    function deleteQuestion(index: number) {
        _deleteQuestion({ questionIndex: index, currentQuestionIndex, quizPoll: quiz, setQuizPoll: setQuiz, setCurrentQuestionIndex });
    }

    function addEmptyQuestion() {
        _addEmptyQuestion({ setQuizPoll: setQuiz });
    }

    function addNewAnswer({ questionIndex, answer }: { questionIndex: number, answer: Partial<QuizAnswer> }) {
        const symbol = quiz.questions.length.toString();
        const _answer: QuizAnswer = { text: '', symbol: symbol, correct: false, explanation: '', ...answer }
        setQuiz((prev) => produce(prev, draft => { draft.questions[questionIndex].answers.push(_answer)}));
    }

    function setAnswerCorrect({ questionIndex, answerIndex, correct }: { questionIndex: number, answerIndex: number, correct: boolean }) {
        setQuiz((prev) => produce(prev, draft => { draft.questions[questionIndex].answers[answerIndex].correct = correct}));
    }

    function setAnswerExplanation({ questionIndex, answerIndex, explanation }: { questionIndex: number, answerIndex: number, explanation: string }) {
        setQuiz((prev) => produce(prev, draft => { draft.questions[questionIndex].answers[answerIndex].explanation = explanation}));
    }

    function setHint({ questionIndex, hint }: { questionIndex: number, hint: string }) {
        setQuiz((prev) => produce(prev, draft => { draft.questions[questionIndex].hint = hint}));
    }


    return (
        <QuizCreationContext.Provider value={{
            quiz,
            setQuiz,
            idToSaveTo,
            setTitle,
            currentQuestionIndex,
            setCurrentQuestionIndex,
            setQuestionText,
            setAnswerText,
            setAnswerSymbol,
            deleteAnswer,
            deleteQuestion,
            addEmptyQuestion,
            addNewAnswer,
            setAnswerCorrect,
            setAnswerExplanation,
            setHint,
        }}>
            {children}
        </QuizCreationContext.Provider>
    );
}


export function useQuizCreation() {
    const context = useContext(QuizCreationContext);
    if (!context) throw new Error('useQuizCreation must be used within a QuizCreationProvider');
    return context;
}


// Mock data

export const testQuiz: Quiz = {
    type: 'quiz',
    schemaVersion: '1',
    title: 'Mon super quiz',
    questions: [
        {
            question: {
                text: 'Quelle est la capitale de la France ?',
            },
            answers: [
                { text: 'Madrid', symbol: 'A', correct: false },
                { text: 'Londres', symbol: 'B', correct: false },
                { text: 'Paris', symbol: 'C', correct: true },
            ]
        },
        {
            question: {
                text: 'Quel est le plus petit pays du monde ?',
            },
            answers: [
                { text: 'Monaco', symbol: '1', correct: false },
                { text: 'Vatican', symbol: '2', correct: true },
                { text: 'Malte', symbol: '3', correct: false },
            ]
        }
    ]
}


export const testPoll: Poll = {
    type: 'poll',
    schemaVersion: '1',
    title: 'Mon super sondage',
    questions: [
        {
            question: {
                text: 'Quelle est votre couleur préférée ?',
            },
            answers: [
                { text: 'Rouge', symbol: 'A', color: 'red' },
                { text: 'Vert', symbol: 'B', color: 'green' },
                { text: 'Bleu', symbol: 'C', color: 'blue' },
            ]
        },
        {
            question: {
                text: 'Quel est votre animal préféré ?',
            },
            answers: [
                { text: 'Chien', symbol: '1', color: 'brown' },
                { text: 'Chat', symbol: '2', color: 'gray' },
                { text: 'Poisson', symbol: '3', color: 'blue' },
            ]
        }
    ]
}

export const emptyQuiz: Quiz = {
    type: 'quiz',
    schemaVersion: '1',
    title: '',
    questions: [
        {
            question: {
                text: '',
            },
            answers: []
        }
    ]
}

export const emptyPoll: Poll = {
    type: 'poll',
    schemaVersion: '1',
    title: '',
    questions: [
        {
            question: {
                text: '',
            },
            answers: []
        }
    ]
}