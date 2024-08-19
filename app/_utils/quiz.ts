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


