import logger from "@/app/_utils/logger"
import { saveRoomActivitySnapshot } from "@/app/(backend)/api/room/room.client"
import { fetchActivity } from "@/app/(backend)/api/activity/activitiy.client"
import { useState, useCallback } from "react"
import { useRoom } from "../contexts/useRoom"
import useQuizAnimationStore from "../stores/useQuizAnimationStore"
import usePollAnimationStore from "../stores/usePollAnimationStore"
import { Quiz, QuizSnapshot } from "@/app/_types/quiz2"
import { Poll, PollSnapshot } from "@/app/_types/poll"

type AsyncOperationResult = { error: string | null }

export function useStartActivityService(): {
    start: (activityId: string | number) => Promise<AsyncOperationResult>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const roomId = useRoom().room?.id

    const start = useCallback(async (activityId: string | number) => {
        if (!roomId) {
            logger.error('zustand:store', 'useStartActivityService.tsx', 'No room id')
            return { error: 'No room id' }
        }

        setIsPending(true)

        const id = parseInt(activityId as string)
        const { data, error } = await fetchActivity(id)

        if (error || !data) {
            logger.error('zustand:store', 'useStartActivityService.tsx', 'Error fetching activity: ' + error)
            setIsPending(false)
            return { error: 'Error fetching activity: ' + error }
        }

        if (data.type === 'quiz') {
            const quiz = data.object as Quiz
            const state = useQuizAnimationStore.getState()

            // Update the store
            state.setQuiz(quiz)
            state.setActivityId(id)
            state.setQuestionId(quiz.questions[0].id)

            // Save the new state in the database
            const snapshot: QuizSnapshot = {
                type: 'quiz',
                activityId: id,
                currentQuestionId: quiz.questions[0].id,
                state: 'answering',
                answers: []
            }

            const { error: saveError } = await saveRoomActivitySnapshot(roomId, snapshot)
            if (saveError) {
                logger.error('zustand:store', 'useStartActivityService.tsx', 'Error saving quiz: ' + saveError)
                state.closeQuiz() // Rollback the store
                setIsPending(false)
                return { error: 'Error saving quiz: ' + saveError }
            }
            
        } else if (data.type === 'poll') {
            const poll = data.object as Poll
            const state = usePollAnimationStore.getState()

            // Update the store
            state.setPoll(poll)
            state.setPollId(id)
            state.setQuestionId(poll.questions[0].id)

            // Save the new state in the database
            const snapshot: PollSnapshot = {
                type: 'poll',
                activityId: id,
                currentQuestionId: poll.questions[0].id,
                state: 'voting',
                answers: []
            }

            const { error: saveError } = await saveRoomActivitySnapshot(roomId, snapshot)
            if (saveError) {
                logger.error('zustand:store', 'useStartActivityService.tsx', 'Error saving poll: ' + saveError)
                state.closePoll() // Rollback the store
                setIsPending(false)
                return { error: 'Error saving poll: ' + saveError }
            }
        } else {
            logger.error('zustand:store', 'useStartActivityService.tsx', 'Unknown activity type')
            setIsPending(false)
            return { error: 'Unknown activity type' }
        }

        setIsPending(false)
        return { error: null }
    }, [roomId])

    return { start, isPending }
}
