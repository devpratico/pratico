'use client'
import { PollSnapshot } from "@/core/domain/entities/poll"
import { QuizSnapshot } from "@/core/domain/entities/quiz"
import { PostgrestError } from "@supabase/supabase-js"
import useFetch from "./useFetch"
import createClient from "@/supabase/clients/client"
import { useCallback } from "react"


type ReturnedType = {
    data: QuizSnapshot | PollSnapshot
    error: null
} | {
    data: null
    error: PostgrestError | Error
}

export default function useActivitySnapshotQuery(): {
    fetchSnapshot: (roomId: string) =>Promise<ReturnedType>
    isPending: boolean
} {
    const fetcher = useCallback(async (roomId: string) => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('rooms')
            .select('activity_snapshot')
            .eq('id', parseInt(roomId))
            .single()

        if (error) return { data: null, error: error }

        //return { data: data?.activity_snapshot as QuizSnapshot | PollSnapshot, error: null }
        const snapshot = data.activity_snapshot

        if (!snapshot || typeof snapshot !== 'object' || !('type' in snapshot)) {
            return { data: null, error: new Error('Invalid snapshot data') };
        }

        if (snapshot.type === 'quiz') {
            return { data: snapshot as unknown as QuizSnapshot, error: null };
        } else if (snapshot.type === 'poll') {
            return { data: snapshot as unknown as  PollSnapshot, error: null };
        } else {
            return { data: null, error: new Error('Unknown snapshot type') };
        }
    }, [])

    const { fetch, isPending } = useFetch(fetcher)

    return { fetchSnapshot: fetch, isPending }
}