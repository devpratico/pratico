import { PollSnapshot } from "./poll"
import { QuizSnapshot } from "./quiz"


export type ActivityType = 'quiz' | 'poll'

export interface Activity {
    type: ActivityType
    title: string
    schemaVersion: string
}

export type ActivitySnapshot = QuizSnapshot | PollSnapshot



export function setTitle<T extends Activity>(activity: T, newTitle: string): T {
    return {
        ...activity,
        title: newTitle,
    };
}