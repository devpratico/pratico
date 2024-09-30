import { PollSnapshot } from "./poll"
import { QuizSnapshot } from "./quiz"


export type ActivityType = 'quiz' | 'poll'

export interface Activity {
    type: ActivityType
    title: string
    schemaVersion: string
}

export type ActivitySnapshot = QuizSnapshot | PollSnapshot