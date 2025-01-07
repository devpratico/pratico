'use client'
import { ActivitySnapshot } from "@/app/_types/activity"
import createClient from "@/supabase/clients/client"
import { useState } from "react"
import { Json } from "@/supabase/types/database.types"
import { PostgrestError } from "@supabase/supabase-js"
import logger from "@/app/_utils/logger"

// TODO: Maybe use Tanstack Query

export function useRoomMutation(): {
    saveActivitySnapshot: (roomId: string, snapshot: ActivitySnapshot | null) => Promise<{ error: PostgrestError | null }>
    isPending: boolean
    error: PostgrestError | null
} {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<PostgrestError | null>(null)

    const saveActivitySnapshot = async (roomId: string, snapshot: ActivitySnapshot | null) => {
        setIsPending(true)
        const supabase = createClient()
        const { error } = await supabase
            .from('rooms')
            .update({ activity_snapshot: snapshot ? snapshot as unknown as Json : null})
            .eq('id', roomId)
            .eq('status', 'open')

        if (error) {
            logger.error('react:hook', 'useRoomMutation.tsx', 'Error saving activity snapshot', error)
            setError(error)
        }
        setIsPending(false)
        return { error }
    }

    return { saveActivitySnapshot, isPending, error }
}