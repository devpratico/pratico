'use client'
import { adapter } from "@/app/(backend)/api/activity/utils"
import createClient from "@/supabase/clients/client"
import useFetch from "./useFetch"
import { Quiz } from "@/core/domain/entities/activities/quiz"
import { Poll } from "@/core/domain/entities/activities/poll"
import { PostgrestError } from "@supabase/supabase-js"
import { Tables } from "@/supabase/types/database.types"
import { useCallback } from "react"


// Supabase returns `Json` instead of `Quiz` or `Poll` objects
// Let's declare the type of data we want to return
interface ReturnedData extends Omit<Tables<'activities'>, 'object'> {
    object: Quiz | Poll
}

type ReturnType = {
    data: ReturnedData
    error: null
} | {
    data: null
    error: PostgrestError | Error
}


export default function useActivityQuery(): {
    fetchActivity: (activityId: number) => Promise<ReturnType>
    isPending: boolean
} {

    const fetcher = useCallback(async (activityId: number) => {
        const supabase = createClient()
        const { data, error } = await supabase.from('activities').select('*').eq('id', activityId).single()

        if (error) return { data: null, error: error }

        const type = data.type

        switch (type) {
            case 'quiz':
                const quiz = adapter.toQuiz(data.object)
                if (!quiz) {
                    return { data: null, error: new Error('Error parsing quiz') }
                }
                return { data: { ...data, object: quiz }, error: null }

            case 'poll':
                const poll = adapter.toPoll(data.object)
                if (!poll) {
                    return { data: null, error: new Error('Error parsing poll') }
                }
                return { data: { ...data, object: poll }, error: null }

            default:
                return { data: null, error: new Error('Unknown activity type') }
        }
    }, [])


    const { fetch, isPending } = useFetch(fetcher)

    return { fetchActivity: fetch, isPending }
}