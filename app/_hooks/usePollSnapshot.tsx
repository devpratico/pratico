 'use client'
import { useRoom } from "./useRoom"
import { PollSnapshot, PollUserAnswer, isPollSnapshot } from "../_types/poll"
import { saveRoomActivitySnapshot } from "../api/_actions/room"
import { fetchUser } from "../api/_actions/user"
import { randomUUID } from "crypto"
import { produce } from "immer"
import { useState, useEffect, useCallback } from "react"
import { isEqual } from "lodash"
import useOptimisticSave from "./useOptimisticSave"


interface PollSnapshotHook {
    snapshot: PollSnapshot | undefined
    isPending: boolean
    setCurrentQuestionId: (id: string) => Promise<{ error: string | null }>
    setQuestionState: (state: 'answering' | 'results') => Promise<{ error: string | null }>
    addAnswer: (questionId: string, choiceId: string) => Promise<{data: PollUserAnswer | null, error: string | null}>
    removeAnswer: (answerId: string) => Promise<{ error: string | null }>
}

export function usePollSnapshot(): PollSnapshotHook {
    const { room } = useRoom()
    const [snapshot, setSnapshot] = useState<PollSnapshot | undefined>(undefined)

    const saveSnapshot = useCallback(async (newSnapshot: PollSnapshot) => {
        if (!room?.code) return { error: 'Room not found' }
        return await saveRoomActivitySnapshot(room.code, newSnapshot)
    }, [room])

    const { optimisticState: optimisticSnapshot, isPending, saveOptimistically } = useOptimisticSave({
        state: snapshot,
        setState: setSnapshot,
        saveFunction: saveSnapshot
    })

    // Sync the snapshot with the database object in real-time thanks to useRoom
    useEffect(() => {
        if (isPollSnapshot(room?.activity_snapshot)) {
            if (!isEqual(room.activity_snapshot, snapshot)) {
                setSnapshot(room.activity_snapshot)
            }
        } else {
            setSnapshot(undefined)
        }
    }, [room, snapshot])


    const setCurrentQuestionId = useCallback(async (id: string) => {
        if (!snapshot) return { error: 'Snapshot not found' }

        const newSnapshot = { ...snapshot, currentQuestionId: id }
        return await saveOptimistically(newSnapshot)
    }, [snapshot, saveOptimistically])


    const setQuestionState = useCallback(async (state: 'answering' | 'results') => {
        if (!snapshot) return { error: 'Snapshot not found' }

        const newSnapshot = {...snapshot, currentQuestionState: state}
        return await saveOptimistically(newSnapshot)
    }, [snapshot, saveOptimistically])


    const addAnswer = useCallback(async (questionId: string, choiceId: string) => {
        if (!snapshot) return { data: null, error: 'Snapshot not found' }

        const { user, error: userError  } = await fetchUser()
        if (!user || userError) return { data: null, error: userError || 'User not found' }

        const newAnswer = {userId: user.id, timestamp: Date.now(), questionId, choiceId} as PollUserAnswer
        const newAnswerId = randomUUID()

        const newSnapshot = produce(snapshot, draft => { draft.answers[newAnswerId] = newAnswer })

        const { error } = await saveOptimistically(newSnapshot)

        if (error) {
            return { data: null, error }
        } else {
            return { data: newAnswer, error: null }
        }
    }, [snapshot, saveOptimistically])



    const removeAnswer = useCallback(async (answerId: string) => {
        if (!snapshot) return { error: 'Snapshot not found' }

        const newSnapshot = produce(snapshot, draft => { delete draft.answers[answerId]})
        return await saveOptimistically(newSnapshot)
    }, [snapshot, saveOptimistically])

    return { snapshot: optimisticSnapshot, isPending, setCurrentQuestionId, setQuestionState, addAnswer, removeAnswer }
}