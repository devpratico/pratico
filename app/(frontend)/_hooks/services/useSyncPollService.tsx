'use client'
import createClient from '@/supabase/clients/client'
import { useEffect, useState } from 'react'
import { fetchActivity } from '@/app/(backend)/api/activity/activitiy.client'
import { fetchSnapshot } from '@/app/(backend)/api/activity/activitiy.client'
import { Poll, isPollSnapshot, PollSnapshot } from '@/app/_types/poll2'
import usePollParticipation from '../stores/usePollParticipation'
import { Tables } from '@/supabase/types/database.types'


/** 
 * Fetches the snapshot from the room table and populates the store
 * If no poll snapshot is found, the store is reset
 */
async function loadSnapshot(roomId: number): Promise<{
    snapshot: PollSnapshot | null
    error: string | null
}> {

    const { data, error } = await fetchSnapshot(roomId)
    if (error) return { snapshot: null, error: 'Error fetching snapshot: ' + error }

    const snapshot = data?.activity_snapshot

    if (!snapshot || !isPollSnapshot(snapshot)) {
        // The snapshot has been deleted or changed to an other activity
        // This is normal behavior, not an error. Just reset the store to null.
        usePollParticipation.getState().setSnapshot(null)
        return { snapshot: null, error: null }
    }

    usePollParticipation.getState().setSnapshot(snapshot)

    return { snapshot: snapshot, error: null }
}


/**
 * Fetches the poll from the activities table and populates the store
 * This one returns an error if the activity is not a poll
 */
async function loadPoll(activityId: number): Promise<{ error: string | null }> {
    const { data, error } = await fetchActivity(activityId)

    if (error || !data)       return { error: 'Error fetching activity' }
    if (data.type !== 'poll') return { error: 'Activity is not a poll'}

    const poll = data.object as Poll

    usePollParticipation.getState().setPoll(poll)

    return { error: null }
}


/**
 * Syncs the local store with the remote database:
 * - Initializes the store with the current snapshot and poll if they exist
 * - Subscribes to the changes in the room table (Supabase realtime)
 */
async function syncRemotePoll(roomId: number): Promise<{
    cleanup: () => void
    error: string | null
}> {

    // TODO: this init may become a provider
    // Check if there is a snapshot and load it in the store
    const { snapshot, error } = await loadSnapshot(roomId)
    if (error) return { error: error, cleanup: () => {} }

    if (snapshot) {
        // Load the poll in the store
        const { error } = await loadPoll(snapshot.activityId)
        if (error) return { error: error, cleanup: () => {} }
    }

    // Listen to changes in the database
    const supabase = createClient()
    const channel = supabase.channel(roomId + "_realtime") // TODO: should this name be different than in usePollAnimation ?
    const roomUpdate = {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}` //filter: `code=eq.${roomCode} AND status=eq.open`
    } as any // TODO: handle type?

    channel.on<Tables<'rooms'>>('postgres_changes', roomUpdate, async (payload): Promise<void> => {
        if (!(payload.eventType === 'UPDATE')) return
        const newRecord = payload.new
        const snapshot = newRecord.activity_snapshot

        if (!isPollSnapshot(snapshot)) {
            // It has been deleted or changed to an other activity snapshot
            // Reset the store
            usePollParticipation.getState().setSnapshot(null)
            usePollParticipation.getState().setPoll(null)
            return
        }

        // The snapshot has changed.
        usePollParticipation.getState().setSnapshot(snapshot)

        // If the activity id has changed, load the new activity
        if (snapshot.activityId !== usePollParticipation.getState().pollId) {
            await loadPoll(snapshot.activityId)
        }
    }).subscribe()

    return {
        cleanup: () => supabase.removeChannel(channel),
        error: null
    }
}


/** Hook to sync the local store with the remote database */
export function useSyncedPoll(roomId: number): {error: string | null} {
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let _cleanup: (() => void) | undefined;

        syncRemotePoll(roomId).then(({ cleanup, error }) => {
            setError(error)
            _cleanup = cleanup
        });

        // Cleanup function
        return () => _cleanup?.()
    }, [roomId]);

    return { error }
}