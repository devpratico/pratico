'use client'
import logger from "@/app/_utils/logger"
import { useState, useCallback } from "react"
import { useRoom } from "../contexts/useRoom"
import useQuizAnimationStore from "../stores/useQuizAnimationStore"
import usePollAnimationStore from "../stores/usePollAnimationStore"
import { Quiz, QuizSnapshot } from "@/core/domain/entities/activities/quiz"
import { Poll, PollSnapshot } from "@/core/domain/entities/activities/poll"
import useActivityQuery from "../queries/useActivityQuery"
import { useRoomMutation } from "../mutations/useRoomMutation"
import useRoomEventsMutation from "../mutations/useRoomEventsMutation"
import { sendDiscordMessage } from "@/app/(backend)/api/discord/discord.client"


type AsyncOperationResult = { error: string | null }

export function useStartActivityService(): {
    start: (activityId: string | number) => Promise<AsyncOperationResult>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)
    const roomId = useRoom().room?.id
    const { fetchActivity } = useActivityQuery()
    const { saveActivitySnapshot } = useRoomMutation()
    const { addStartActivityEvent } = useRoomEventsMutation(`${roomId}`)

    const start = useCallback(async (activityId: string | number) => {
        logger.log('zustand:store', 'useStartActivityService.tsx', 'Starting activity', activityId)
        if (!roomId) {
            logger.error('zustand:store', 'useStartActivityService.tsx', 'No room id')
            return { error: 'No room id' }
        }

        setIsPending(true)

        const id = parseInt(activityId as string)
        logger.log('zustand:store', 'useStartActivityService.tsx', 'Fetching activity', id)
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
            state.setQuestionId(quiz.questions[0].id)
            state.setQuiz(quiz)
            state.setActivityId(id)


            // Save the new state in the database
            const snapshot: QuizSnapshot = {
                type: 'quiz',
                activityId: id,
                currentQuestionId: quiz.questions[0].id,
                state: 'answering',
                answers: []
            }

            logger.log('zustand:store', 'useStartActivityService.tsx', 'Saving quiz snapshot in database', snapshot)

            const { error: saveError } = await saveActivitySnapshot(`${roomId}`, snapshot)
            if (saveError) {
                logger.error('zustand:store', 'useStartActivityService.tsx', 'Error saving quiz: ' + saveError)
                state.closeQuiz() // Rollback the store
                setIsPending(false)
                return { error: 'Error saving quiz: ' + saveError }
            }

            addStartActivityEvent(`${id}`, 'quiz')

            const sendDiscordAlert = sendDiscordMessage.bind(null, `**🏆 Démarrage d'un quiz**`)
            await sendDiscordAlert();

            
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

            logger.log('zustand:store', 'useStartActivityService.tsx', 'Saving poll snapshot in database', snapshot)

            const { error: saveError } = await saveActivitySnapshot(`${roomId}`, snapshot)
            if (saveError) {
                logger.error('zustand:store', 'useStartActivityService.tsx', 'Error saving poll: ' + saveError)
                state.closePoll() // Rollback the store
                setIsPending(false)
                return { error: 'Error saving poll: ' + saveError }
            }

            addStartActivityEvent(`${id}`, 'poll')

            const sendDiscordAlert = sendDiscordMessage.bind(null, `**🗳️ Démarrage d'un Sondage**`)
            await sendDiscordAlert();


        } else {
            logger.error('zustand:store', 'useStartActivityService.tsx', 'Unknown activity type')
            setIsPending(false)
            return { error: 'Unknown activity type' }
        }

        logger.log('zustand:store', 'useStartActivityService.tsx', 'Activity snapshot successfully saved')

        setIsPending(false)
        return { error: null }

    }, [roomId, fetchActivity, saveActivitySnapshot, addStartActivityEvent])

    return { start, isPending }
}


