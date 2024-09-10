'use client'
import { useRoom } from "./useRoom"
import { Quiz, QuizSnapshot, QuizUserAnswer, isQuizSnapshot } from "../_types/quiz"
import { saveRoomActivitySnapshot } from "../api/_actions/room"
import { fetchUser } from "../api/_actions/user"
import { randomUUID } from "crypto"
import { produce } from "immer"
import { useState, useEffect, useCallback, useOptimistic } from "react"
//import { isEqual } from "lodash"


interface QuizSnapshotHook {
    snapshot: QuizSnapshot | undefined
    isLoading: boolean
    setCurrentQuestionIndex: (index: number) => Promise<{ error: string | null }>
    setQuestionState: (state: 'answering' | 'results') => Promise<{ error: string | null }>
    addAnswer: (questionId: string, choiceId: string) => Promise<{data: QuizUserAnswer | null, error: string | null}>
    removeAnswer: (answerId: string) => Promise<{ error: string | null }>
}

export function useQuizSnapshot(): QuizSnapshotHook {
    const { room } = useRoom()
    const [snapshot, setSnapshot] = useState<QuizSnapshot | undefined>(undefined) // Local state to have more control over the snapshot updates
    const [isLoading, setIsLoading] = useState<boolean>(false) // Use this to show a isLoading spinner while the snapshot is being saved
    const [optimisticSnapshot, setOptimisticSnapshot] = useOptimistic<QuizSnapshot | undefined, QuizSnapshot | undefined>(snapshot, (realSnapshot, optimisticSnapshot) => {
        setIsLoading(true)
        return optimisticSnapshot
    })

    useEffect(() => {
        if (room?.activity_snapshot && isQuizSnapshot(room.activity_snapshot)){ //} && !isEqual(room.activity_snapshot, snapshot))) {
            setSnapshot(room.activity_snapshot as QuizSnapshot)
            setIsLoading(false)
        }
    }, [room, snapshot])

    const setCurrentQuestionIndex = useCallback(async (index: number) => {
        if (!snapshot ) return { error: 'Snapshot not found' }
        if (!room?.code) return { error: 'Room not found' }

        const newSnapshot = {...snapshot, currentQuestionIndex: index}
        setOptimisticSnapshot(newSnapshot)
        return await saveRoomActivitySnapshot(room.code, newSnapshot)
    }, [snapshot, room, setOptimisticSnapshot])


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

        const newAnswer: QuizUserAnswer = {
            userId: user.id,
            timestamp: Date.now(),
            questionId,
            choiceId
        }

        const newSnapshot = produce(snapshot, draft => {
            draft.answers[randomUUID()] = newAnswer
        })

        setOptimisticSnapshot(newSnapshot)
        return { data: newAnswer, error: null }
    }, [snapshot, room, setOptimisticSnapshot])


    const removeAnswer = useCallback(async (answerId: string) => {
        if (!room?.code) return { error: 'Room not found' }
        if (!snapshot) return { error: 'Snapshot not found' }

        const newSnapshot = produce(snapshot, draft => {
            delete draft.answers[answerId]
        })

        setOptimisticSnapshot(newSnapshot)
        return { error: null }
    }, [snapshot, room, setOptimisticSnapshot])

    return { snapshot: optimisticSnapshot, isLoading, setCurrentQuestionIndex, setQuestionState, addAnswer, removeAnswer }
}