'use client'
import { useRoom } from "./useRoom"
import { Poll, PollSnapshot, PollUserAnswer } from "../_types/poll"
import { saveRoomActivitySnapshot } from "../api/_actions/room"
import { fetchUser } from "../api/_actions/user"


interface PollSnapshotHook {
    snapshot: PollSnapshot | undefined
    setCurrentQuestionIndex: (index: number) => void
    setQuestionState: (state: 'answering' | 'results') => void
    addAnswer: (questionId: string, choiceId: string) => PollUserAnswer
    removeAnswer: (answerId: string) => void
}

export function usePollSnapshot(pollId: number): PollSnapshotHook {
    const { room } = useRoom()

    const snapshot = room?.activity_snapshot || undefined

    if (snapshot?.type !== 'poll') {
        return {
            snapshot: undefined,
            setCurrentQuestionIndex: () => {},
            setQuestionState: () => {},
            addAnswer: () => {},
            removeAnswer: () => {},
        }
    }

    const setCurrentQuestionIndex = (index: number) => {
        if (!room?.code) return
        const newSnapshot = {...snapshot, currentQuestionIndex: index}
        saveRoomActivitySnapshot(room.code, newSnapshot)
    }

    const setQuestionState = (state: 'answering' | 'results') => {
        if (!room?.code) return
        const newSnapshot = {...snapshot, currentQuestionState: state}
        saveRoomActivitySnapshot(room.code, newSnapshot)
    }

    const addAnswer = (questionId: string, choiceId: string) => {
        if (!room?.code) return
        const newAnswer = {userId: 'user1', timestamp: Date.now(), questionId, choiceId}
        const newAnswers = {...snapshot.answers, [newAnswer.userId]: newAnswer}
        const newSnapshot = {...snapshot, answers: newAnswers}
        saveRoomActivitySnapshot(room.code, newSnapshot)
    }


}