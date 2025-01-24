import { Tables } from "@/supabase/types/database.types";
import { PollSnapshot } from "./poll"
import { QuizSnapshot } from "./quiz"
import { produce } from "immer"

export type ActivityType = 'quiz' | 'poll'

export type ActivityTypeTable = Tables<'activities'>;

export type ActivityTypeWidget = {
    id: number,
    type: string,
    title: string | undefined,
    launched_at: string,
    stopped_at: string,
    percentage: number,
    nbQuestions: number
}

export interface Activity {
    type: ActivityType
    title: string
    schemaVersion: string
}

export type ActivitySnapshot = PollSnapshot | QuizSnapshot


type ActivityUpdater<T extends Activity> = (activity: T) => T


export function changeTitle<T extends Activity>(newTitle: string): ActivityUpdater<T> {
    return (activity: T) => produce(activity, draft => { draft.title = newTitle })
}