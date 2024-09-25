'use client'
import { useRoom } from "./useRoom"
import { QuizSnapshot, QuizUserAnswer, isQuizSnapshot } from "../_types/quiz"
import { saveRoomActivitySnapshot } from "../api/_actions/room"
import { fetchUser } from "../api/_actions/user"
import { produce } from "immer"
import { useState, useEffect, useCallback } from "react"
import { isEqual } from "lodash"
import useOptimisticSave from "./useOptimisticSave"


interface QuizSnapshotHook {
    snapshot: QuizSnapshot | undefined
    isPending: boolean
    setCurrentQuestionId: (id: string) => Promise<{ error: string | null }>
    setQuestionState: (state: 'answering' | 'results') => Promise<{ error: string | null }>
    addAnswer: (questionId: string, choiceId: string) => Promise<{data: QuizUserAnswer | null, error: string | null}>
    removeAnswer: (answerId: string) => Promise<{ error: string | null }>
}

export function useQuizSnapshot(): QuizSnapshotHook {
    const { room } = useRoom()
    const [snapshot, setSnapshot] = useState<QuizSnapshot | undefined>(() => {
        if (room && isQuizSnapshot(room.activity_snapshot)) {
            return room.activity_snapshot
        } else {
            return undefined
        }
    })

    const saveSnapshot = useCallback(async (newSnapshot: QuizSnapshot) => {
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
        if (isQuizSnapshot(room?.activity_snapshot)) {
            if (!isEqual(room.activity_snapshot, snapshot)) {
                setSnapshot(room.activity_snapshot)
            }
        } else {
            setSnapshot(undefined)
        }
    }, [room, snapshot])


    const setCurrentQuestionId = useCallback(async (id: string) => {
        if (!snapshot ) return { error: 'Snapshot not found' }

        const newSnapshot = {...snapshot, currentQuestionId: id}
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

        const newAnswer: QuizUserAnswer = {
            userId: user.id,
            timestamp: Date.now(),
            questionId,
            choiceId
        }

        const newSnapshot = produce(snapshot, draft => {
            const id = `${newAnswer.userId}-${newAnswer.timestamp}`
            draft.answers[id] = newAnswer
        })

        const { error } = await saveOptimistically(newSnapshot)

        if (error) {
            return { data: null, error }
        } else {
            return { data: newAnswer, error: null }
        }
    }, [snapshot, saveOptimistically])


    const removeAnswer = useCallback(async (answerId: string) => {
        if (!snapshot) return { error: 'Snapshot not found' }

        const newSnapshot = produce(snapshot, draft => {
            delete draft.answers[answerId]
        })

        return await saveOptimistically(newSnapshot)
    }, [snapshot, saveOptimistically])

    return { snapshot: optimisticSnapshot, isPending, setCurrentQuestionId, setQuestionState, addAnswer, removeAnswer }
}