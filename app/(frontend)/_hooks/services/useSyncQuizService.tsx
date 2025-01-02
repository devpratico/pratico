'use client'
import createClient from '@/supabase/clients/client'
import { useEffect, useState } from 'react'
import { fetchActivity } from '@/app/(backend)/api/activity/activitiy.client'
import { fetchSnapshot } from '@/app/(backend)/api/activity/activitiy.client'
import { Quiz, isQuizSnapshot, QuizSnapshot } from '@/app/_types/quiz2'
import { Tables } from '@/supabase/types/database.types'
import logger from '@/app/_utils/logger'
import { useRoom } from '../contexts/useRoom'

/**
 * Low level service that fetches the snapshot from the room table and keeps it in sync real-time.
 * Provide callbacks to react to changes.
 * Should be used by higher level services (quiz animation and participation).
 */
export default function useSyncQuizService(): {
    quiz: Quiz | null
    snapshot: QuizSnapshot | null
    isSyncing: boolean
    error: string | null
} {
    const roomId = useRoom().room?.id
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [snapshot, setSnapshot] = useState<QuizSnapshot | null>(null)
    const [isSyncing, setIsSyncing] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch initial data
    useEffect(() => {
        logger.log('react:hook', 'useSyncQuizService.tsx', 'useEffect', 'Fetching initial data')
        if (!roomId) return
        setIsSyncing(true)
        setError(null)

        getQuizAndSnapshot(roomId).then(({ quiz, snapshot, error }) => {
            setIsSyncing(false)
            setError(error)
            setQuiz(quiz)
            setSnapshot(snapshot)
            logger.log('react:hook', 'useSyncQuizService.tsx', 'Initial data fetched', quiz, snapshot)
        })

    }, [roomId])

    // Sync with database real-time
    useEffect(() => {
        if (!roomId) return
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
            logger.log('react:hook', 'useSyncQuizService.tsx', 'Supabase channel change detected in room', roomId)
            setError(null)
            const oldSnapshot = payload.old.activity_snapshot
            const newSnapshot = payload.new.activity_snapshot

            // If it's not a quiz snapshot, empty the store
            if (!isQuizSnapshot(newSnapshot)) {
                setQuiz(null)
                setSnapshot(null)
                return
            }

            // It's a quiz. Update the store snapshot
            setSnapshot(newSnapshot)

            // Maybe the activity has changed. Update it if needed
            const oldQuizId = isQuizSnapshot(oldSnapshot) ? oldSnapshot.activityId : null
            let newQuizId = newSnapshot.activityId
            newQuizId = parseInt(newQuizId as string)

            if (oldQuizId !== newQuizId) {
                setIsSyncing(true)
                const { quiz, error } = await getQuiz(newQuizId)
                setIsSyncing(false)
                if (error) {
                    setError(error)
                    return
                }
                setQuiz(quiz)
            }

        }).subscribe()

        return () => {supabase.removeChannel(channel)}
    }, [roomId])

    return { quiz, snapshot, isSyncing, error }
}

// Utils

async function getQuizSnapshot(roomId: number): Promise<{
    snapshot: QuizSnapshot | null
    error: string | null
}> {
    const { data, error } = await fetchSnapshot(roomId)
    if (error) return { snapshot: null, error: 'Error fetching snapshot: ' + error }

    const snapshot = data?.activity_snapshot

    if (!snapshot || !isQuizSnapshot(snapshot)) {
        // The snapshot has been deleted or changed to another activity
        return { snapshot: null, error: null }
    }

    return { snapshot: snapshot, error: null }
}

async function getQuiz(activityId: number): Promise<{
    quiz: Quiz | null
    error: string | null
}> {
    const { data, error } = await fetchActivity(activityId)

    if (error || !data) return { quiz: null, error: 'Error fetching activity' }
    if (data.type !== 'quiz') return { quiz: null, error: 'Activity is not a quiz' }

    const quiz = data.object as Quiz

    return { quiz: quiz, error: null }
}

async function getQuizAndSnapshot(roomId: number): Promise<{
    quiz: Quiz | null
    snapshot: QuizSnapshot | null
    error: string | null
}> {
    const { snapshot, error } = await getQuizSnapshot(roomId)
    if (error) return { quiz: null, snapshot: null, error: error }

    if (snapshot) {
        const { quiz, error } = await getQuiz(parseInt(snapshot.activityId as string))
        if (error) return { quiz: null, snapshot: null, error: error }
        return { quiz: quiz, snapshot: snapshot, error: null }
    }

    return { quiz: null, snapshot: null, error: null }
}
