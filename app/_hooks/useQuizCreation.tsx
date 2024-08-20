'use client'
import { useState, useContext, createContext } from "react"


export interface Answer {
    text: string
    correct?: boolean
}


export interface QuestionParams {
    showLiveAnswers: boolean
}


export interface Question {
    text: string
    answers: Answer[]
    params?: QuestionParams
}


export interface Quiz {
    title: string
    questions: Question[]
}


type QuizCreationContextType = {

    quiz: Quiz | undefined;

    setQuiz: (quiz: Quiz) => void;

    /**
     * This is the index of the current question being displayed and edited.
     * (We typically display one question at a time during quiz creation.
     */
    currentQuestionIndex: number;

    /**
     * Sets the index of the current question being edited.
     * (We typically display one question at a time during quiz creation.)
     */
    setCurrentQuestionIndex: (index: number) => void;

    /**
     * Replaces the text of the question at the given index.
     * Does nothing if the index is out of bounds.
     * @param index The index of the question to set the text of.
     * @param text The new text of the question.
     */
    setQuestionText: ({ index, text }: { index: number, text: string }) => void;

    /**
     * Replaces the text of the answer at the given question and answer index.
     * Does nothing if the indices are out of bounds.
     * @param questionIndex The index of the question containing the answer.
     * @param answerIndex The index of the answer to set the text of.
     */
    setAnswerText: ({ questionIndex, answerIndex, text }: { questionIndex: number, answerIndex: number, text: string }) => void;

    /**
     * Replaces the correct flag of the answer at the given question and answer index.
     * @param questionIndex The index of the question containing the answer.
     * @param answerIndex The index of the answer to set the correct flag of.
     * @param correct The new value of the correct flag.
     */
    setAnswerCorrect: ({ questionIndex, answerIndex, correct }: { questionIndex: number, answerIndex: number, correct: boolean | undefined }) => void;

    /**
     * Append a new answer to the question's answers array.
     */
    addNewAnswer: ({ questionIndex, answer }: { questionIndex: number, answer: Answer }) => void;

    /**
     * Deletes an answer from a question.
     * @param questionIndex The index of the question containing the answer.
     * @param answerIndex The index of the answer to delete.
     */
    deleteAnswer: ({ questionIndex, answerIndex }: { questionIndex: number, answerIndex: number }) => void;

    deleteQuestion: (index: number) => void;

    /**
     * Append a new empty question to the quiz.
     */
    addNewQuestion: () => void;
};


const emptyQuizCreationContext: QuizCreationContextType = {
    quiz: undefined,
    setQuiz: () => {},
    currentQuestionIndex: 0,
    setCurrentQuestionIndex: () => {},
    setQuestionText: () => {},
    setAnswerText: () => {},
    setAnswerCorrect: () => {},
    addNewAnswer: () => {},
    deleteAnswer: () => {},
    deleteQuestion: () => {},
    addNewQuestion: () => {},
};


const QuizCreationContext = createContext<QuizCreationContextType>(emptyQuizCreationContext);


export function QuizCreationProvider({ initialQuiz, children }: { initialQuiz: Quiz | undefined, children: React.ReactNode }) {
    const [quiz, setQuiz] = useState<Quiz | undefined>(initialQuiz);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    function setQuestionText({ index, text }: { index: number, text: string }) {
        setQuiz((prev) => {
            if (!prev || !prev.questions[index]) return prev;
            return {
                ...prev,
                questions: prev.questions.map((question, i) => {
                    if (i === index) {
                        return {
                            ...question,
                            text,
                        };
                    }
                    return question;
                }),
            }
        });
    }

    function setAnswerText({ questionIndex, answerIndex, text }: { questionIndex: number, answerIndex: number, text: string }) {
        setQuiz((prev) => {
            if (!prev || !prev.questions[questionIndex] || !prev.questions[questionIndex].answers[answerIndex]) return prev;
            return {
                ...prev,
                questions: prev.questions.map((question, index) => {
                    if (index === questionIndex) {
                        return {
                            ...question,
                            answers: question.answers.map((answer, index) => {
                                if (index === answerIndex) {
                                    return {
                                        ...answer,
                                        text,
                                    };
                                }
                                return answer;
                            }),
                        };
                    }
                    return question;
                }),
            }
        });
    }

    function setAnswerCorrect({ questionIndex, answerIndex, correct }: { questionIndex: number, answerIndex: number, correct: boolean | undefined }) {
        setQuiz((prev) => {
            if (!prev || !prev.questions[questionIndex] || !prev.questions[questionIndex].answers[answerIndex]) return prev;
            return {
                ...prev,
                questions: prev.questions.map((question, index) => {
                    if (index === questionIndex) {
                        return {
                            ...question,
                            answers: question.answers.map((answer, index) => {
                                if (index === answerIndex) {
                                    return {
                                        ...answer,
                                        correct,
                                    };
                                }
                                return answer;
                            }),
                        };
                    }
                    return question;
                }),
            }
        });
    }

    function addNewAnswer({ questionIndex, answer }: { questionIndex: number, answer: Answer }) {
        setQuiz((prev) => {
            if (!prev || !prev.questions[questionIndex]) return prev;
            return {
                ...prev,
                questions: prev.questions.map((question, index) => {
                    if (index === questionIndex) {
                        return {
                            ...question,
                            answers: [...question.answers, answer],
                        };
                    }
                    return question;
                }),
            };
        });
    }

    function deleteAnswer({ questionIndex, answerIndex }: { questionIndex: number, answerIndex: number }) {
        setQuiz((prev) => {
            if (!prev || !prev.questions[questionIndex]) return prev;
            return {
                ...prev,
                questions: prev.questions.map((question, index) => {
                    if (index === questionIndex) {
                        return {
                            ...question,
                            answers: question.answers.filter((_, i) => i !== answerIndex),
                        };
                    }
                    return question;
                }),
            }
        });
    }

    function deleteQuestion(index: number) {
        setQuiz((prev) => {
            if (!prev || !prev.questions[index]) return prev;

            // If the question being deleted is the current question and is the last question,
            // we need to move the current question index back by one.
            if (currentQuestionIndex === index && currentQuestionIndex === prev.questions.length - 1 && currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
            }

            return {
                ...prev,
                questions: prev.questions.filter((_, i) => i !== index),
            }
        });
    }

    function addNewQuestion() {
        setQuiz((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                questions: [...prev.questions, {
                    text: '',
                    answers: [],
                }],
            }
        });
    }


    return (
        <QuizCreationContext.Provider value={{
            quiz,
            setQuiz,
            currentQuestionIndex,
            setCurrentQuestionIndex,
            setQuestionText,
            setAnswerText,
            setAnswerCorrect,
            addNewAnswer,
            deleteAnswer,
            deleteQuestion,
            addNewQuestion,
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