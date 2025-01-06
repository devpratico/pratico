'use client'
import { Poll } from "@/app/_types/poll"
import { Quiz } from "@/app/_types/quiz"
import { PollSnapshot } from "@/app/_types/poll"
import { QuizSnapshot } from "@/app/_types/quiz"
import { useRoom } from "./useRoom"
import { useState, useEffect, useMemo, createContext, useContext } from "react"
import logger from "@/app/_utils/logger"
import { fetchSnapshot } from '@/app/(backend)/api/activity/activitiy.client'
import createClient from "@/supabase/clients/client"
import { Tables } from "@/supabase/types/database.types"
import { fetchActivity } from "@/app/(backend)/api/activity/activitiy.client"


type ActivitySnapshot = PollSnapshot | QuizSnapshot


/**
 * Fetches the snapshot from the room table and keeps it in sync real-time.
 */
function useRealtimeSnapshot(): {
    snapshot: ActivitySnapshot | null
    isSyncing: boolean
    error: string | null
} {
    const roomId = useRoom().room?.id
    const [snapshot, setSnapshot] = useState<ActivitySnapshot | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch initial data
    useEffect(() => {
        if (!roomId) return
        setIsSyncing(true)
        setError(null)

        fetchSnapshot(roomId).then(({data, error}) => {
            setIsSyncing(false)
            if (error) {
                setError(error)
                return
            }
            const _snapshot = data!.activity_snapshot as unknown as ActivitySnapshot
            setSnapshot(_snapshot)
        })
    }, [roomId])

    // Sync with database real-time
    useEffect(() => {
        if (!roomId) return
        const supabase = createClient()
        const channel = supabase.channel(roomId + "_realtimeActivity")
        const roomUpdate = {
            event: 'UPDATE',
            schema: 'public',
            table: 'rooms',
            filter: `id=eq.${roomId}`
        } as any

        channel.on<Tables<'rooms'>>('postgres_changes', roomUpdate, async (payload) => {
            if (!(payload.eventType === 'UPDATE')) return
            logger.log('react:hook', 'useSyncActivitySnapshotService.tsx', 'Supabase channel change detected in room', roomId)
            setError(null)

            const newSnapshot = payload.new.activity_snapshot as unknown as ActivitySnapshot | null
            setSnapshot(newSnapshot)
            
        }).subscribe()

        return () => { supabase.removeChannel(channel)}
    }, [roomId])

    return { snapshot, isSyncing, error }
}


/**
 * Returns the snapshot in the room, and the activity object, real-time synced.
 */
function useRealtimeActivity(): {
    activity: Poll | Quiz | null
    snapshot: ActivitySnapshot | null
    isSyncing: boolean
    error: string | null
} {
    const { snapshot, isSyncing: isSnapshotSyncing, error: snapshotError } = useRealtimeSnapshot()
    const [activity, setActivity] = useState<Poll | Quiz | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const activityId = useMemo(() => snapshot?.activityId ? parseInt(snapshot.activityId as string) : null, [snapshot])

    // When activityId change in the snapshot, fetch the new activity
    useEffect(() => {
        setError(null)

        if (!activityId) {
            setActivity(null)
            return
        }
        setIsSyncing(true)
        fetchActivity(activityId).then(({data, error}) => {
            setIsSyncing(false)
            if (error) {
                setError(error)
                return
            }
            const _activity = data!.object as Poll | Quiz | null
            setActivity(_activity)
        })

    }, [activityId])
    

    return {
        activity,
        snapshot,
        isSyncing: isSnapshotSyncing || isSyncing,
        error: snapshotError || error
    }
}



// Make a context out of this to avoid creating multiple instances of the hook

type RealtimeActivityContext = ReturnType<typeof useRealtimeActivity>

const RealtimeActivityContext = createContext<RealtimeActivityContext | null>(null)

export function RealtimeActivityProvider({ children }: { children: React.ReactNode }) {
    const value = useRealtimeActivity()
    return (
        <RealtimeActivityContext.Provider value={value}>
            {children}
        </RealtimeActivityContext.Provider>
    )
}

export function useRealtimeActivityContext() {
    const context = useContext(RealtimeActivityContext)
    if (!context) throw new Error("useRealtimeActivity must be used within a RealtimeActivityProvider")
    return context
}