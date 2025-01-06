import { PollSnapshot } from "./poll"
import { QuizSnapshot as QuizSnapshot2 } from "./quiz"
import { produce } from "immer"

export type ActivityType = 'quiz' | 'poll'

export interface Activity {
    type: ActivityType
    title: string
    schemaVersion: string
}

export type ActivitySnapshot = PollSnapshot | QuizSnapshot2


type ActivityUpdater<T extends Activity> = (activity: T) => T


export function changeTitle<T extends Activity>(newTitle: string): ActivityUpdater<T> {
    return (activity: T) => produce(activity, draft => { draft.title = newTitle })
}