'use client'
import createClient from '@/supabase/clients/client'
import { useEffect, useState } from 'react'
import { fetchActivity } from '@/app/(backend)/api/activity/activitiy.client'
import { fetchSnapshot } from '@/app/(backend)/api/activity/activitiy.client'
import { Poll, isPollSnapshot, PollSnapshot } from '@/app/_types/poll2'
import { Tables } from '@/supabase/types/database.types'


/**
 * Low level service that fetches the snapshot from the room table and keeps it in sync real-time.
 * Provide callbacks to react to changes.
 * Should be used by higher level services (poll animation and participation).
 */
export default function useSyncPollService(args: {
    roomId: number
    onPollChange: (poll: Poll | null) => void
    onSnapshotChange: (snapshot: PollSnapshot | null) => void
}): {
    isSyncing: boolean
    error: string | null
} {
    const [isSyncing, setIsSyncing] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { roomId, onPollChange, onSnapshotChange } = args

    // Fetch initial data
    useEffect(() => {
        setIsSyncing(true)
        setError(null)

        getPollAndSnapshot(roomId).then(({ poll, snapshot, error }) => {
            setIsSyncing(false)
            setError(error)
            onPollChange(poll)
            onSnapshotChange(snapshot)
        })

    }, [roomId])

    // Sync with database real-time
    useEffect(() => {
        const supabase = createClient()
        const channel = supabase.channel(roomId + "_realtime")
        const roomUpdate = {
            event: 'UPDATE',
            schema: 'public',
            table: 'rooms',
            filter: `id=eq.${roomId}`
        } as any

        channel.on<Tables<'rooms'>>('postgres_changes', roomUpdate, async (payload) => {
            if (!(payload.eventType === 'UPDATE')) return
            setError(null)
            const oldSnapshot = payload.old.activity_snapshot
            const newSnapshot = payload.new.activity_snapshot

            // If it's not a poll snapshot, empty the store
            if (!isPollSnapshot(newSnapshot)) {
                onSnapshotChange(null)
                onPollChange(null)
                return
            }

            // It's a poll. Update the store snapshot
            onSnapshotChange(newSnapshot)

            // Maybe the activity has changed. Update it if needed
            const oldPollId = isPollSnapshot(oldSnapshot) ? oldSnapshot.activityId : null
            const newPollId = newSnapshot.activityId

            if (oldPollId !== newPollId) {
                setIsSyncing(true)
                const { poll, error } = await getPoll(newPollId)
                setIsSyncing(false)
                if (error) {
                    setError(error)
                    return
                }
                onPollChange(poll)
            }

        }).subscribe()

        return () => {supabase.removeChannel(channel)}
    }, [roomId])


    return { isSyncing, error}
}


// Utils

async function getPollSnapshot(roomId: number): Promise<{
    snapshot: PollSnapshot | null
    error: string | null
}> {
    const { data, error } = await fetchSnapshot(roomId)
    if (error) return { snapshot: null, error: 'Error fetching snapshot: ' + error }

    const snapshot = data?.activity_snapshot

    if (!snapshot || !isPollSnapshot(snapshot)) {
        // The snapshot has been deleted or changed to an other activity
        return { snapshot: null, error: null }
    }

    return { snapshot: snapshot, error: null }
}


async function getPoll(activityId: number): Promise<{
    poll: Poll | null
    error: string | null
}> {
    const { data, error } = await fetchActivity(activityId)

    if (error || !data) return { poll: null, error: 'Error fetching activity' }
    if (data.type !== 'poll') return { poll: null, error: 'Activity is not a poll' }

    const poll = data.object as Poll

    return { poll: poll, error: null }
}


async function getPollAndSnapshot(roomId: number): Promise<{
    poll: Poll | null
    snapshot: PollSnapshot | null
    error: string | null
}> {
    const { snapshot, error } = await getPollSnapshot(roomId)
    if (error) return { poll: null, snapshot: null, error: error }

    if (snapshot) {
        const { poll, error } = await getPoll(snapshot.activityId)
        if (error) return { poll: null, snapshot: null, error: error }
        return { poll: poll, snapshot: snapshot, error: null }
    }

    return { poll: null, snapshot: null, error: null }
}