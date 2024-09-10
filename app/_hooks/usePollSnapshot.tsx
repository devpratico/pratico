 'use client'
import { useRoom } from "./useRoom"
import { Poll, PollSnapshot, PollUserAnswer, isPollSnapshot } from "../_types/poll"
import { saveRoomActivitySnapshot } from "../api/_actions/room"
import { fetchUser } from "../api/_actions/user"
import { randomUUID } from "crypto"
import { produce } from "immer"
import { useState, useEffect, useCallback, useOptimistic, useTransition } from "react"
import { isEqual } from "lodash"


interface PollSnapshotHook {
    snapshot: PollSnapshot | undefined
    isPending: boolean
    setCurrentQuestionIndex: (index: number) => Promise<{ error: string | null }>
    setQuestionState: (state: 'answering' | 'results') => Promise<{ error: string | null }>
    addAnswer: (questionId: string, choiceId: string) => Promise<{data: PollUserAnswer | null, error: string | null}>
    removeAnswer: (answerId: string) => Promise<{ error: string | null }>
}

export function usePollSnapshot(): PollSnapshotHook {
    const { room } = useRoom()
    const [snapshot, setSnapshot] = useState<PollSnapshot | undefined>(undefined)
    const [optimisticSnapshot, setOptimisticSnapshot] = useOptimistic(snapshot);
    const [isPending, startTransition] = useTransition()


    useEffect(() => {
        if (room?.activity_snapshot && isPollSnapshot(room.activity_snapshot) && !isEqual(room.activity_snapshot, snapshot)) {
            setSnapshot(room.activity_snapshot as PollSnapshot)

        } else if (!room?.activity_snapshot && snapshot) {
            setSnapshot(undefined)
        }
    }, [room, snapshot])


    const optimisticallyUpdateSnapshot = useCallback(async (newSnapshot: PollSnapshot) => {
        if (!room?.code) return { error: 'Room not found' }

        let error: string | null = null

        await new Promise<void>(async (resolve) => {
            startTransition(async () => {
                setOptimisticSnapshot(newSnapshot);
                ({ error } = await saveRoomActivitySnapshot(room.code!, newSnapshot))
                if (!error) setSnapshot(newSnapshot)

                resolve()
            })
        })

        return { error }
    }, [room, setOptimisticSnapshot])


    const setCurrentQuestionIndex = useCallback(async (index: number) => {
        if (!snapshot) return { error: 'Snapshot not found' }

        const newSnapshot = { ...snapshot, currentQuestionIndex: index }
        return await optimisticallyUpdateSnapshot(newSnapshot)
    }, [snapshot, optimisticallyUpdateSnapshot])

    // TODO: Do the same below.


    const setQuestionState = useCallback(async (state: 'answering' | 'results') => {
        if (!room?.code) return { error: 'Room not found' }
        if (!snapshot) return { error: 'Snapshot not found' }

        const newSnapshot = {...snapshot, currentQuestionState: state}
        return await saveRoomActivitySnapshot(room.code, newSnapshot)
    }, [snapshot, room])


    const addAnswer = useCallback(async (questionId: string, choiceId: string) => {
        if (!room?.code) return { data: null, error: 'Room not found' }
        if (!snapshot) return { data: null, error: 'Snapshot not found' }

        const { user, error: userError  } = await fetchUser()
        if (!user || userError) return { data: null, error: userError || 'User not found' }

        const newAnswer = {userId: user.id, timestamp: Date.now(), questionId, choiceId} as PollUserAnswer
        const newAnswerId = randomUUID()

        const newSnapshot = produce(snapshot, draft => {
            draft.answers[newAnswerId] = newAnswer
        })

        const { error } = await saveRoomActivitySnapshot(room.code, newSnapshot)

        if (error) return { data: null, error }

        return { data: newAnswer, error: null }
    }, [snapshot, room])



    const removeAnswer = useCallback(async (answerId: string) => {
        if (!room?.code) return { error: 'Room not found' }
        if (!snapshot) return { error: 'Snapshot not found' }

        const newSnapshot = produce(snapshot, draft => {
            delete draft.answers[answerId]
        })

        return await saveRoomActivitySnapshot(room.code, newSnapshot)
    }, [snapshot, room])

    return { snapshot: optimisticSnapshot, isPending, setCurrentQuestionIndex, setQuestionState, addAnswer, removeAnswer }
}