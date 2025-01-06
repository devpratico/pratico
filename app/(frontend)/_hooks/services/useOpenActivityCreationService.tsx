import { useCallback, useState } from 'react'
import { Activity } from '@/app/_types/activity'
import { fetchActivity } from '@/app/(backend)/api/activity/activitiy.client'
import usePollCreationStore from '../stores/usePollCreationStore'
import useQuizCreationStore from '../stores/useQuizCreationStore'
import logger from '@/app/_utils/logger'
import { Poll } from '@/app/_types/poll'
import { Quiz } from '@/app/_types/quiz2'


export default function useOpenActivityCreationService(): {
    openActivity: (activityId: number) => Promise<{error: string | null}>
    isPending: boolean
} {
    const [isPending, setIsPending] = useState(false)

    const openActivity = useCallback(async (activityId: number) => {
        setIsPending(true)
        const { data, error } = await fetchActivity(activityId)
        setIsPending(false)

        if (error || !data?.object) {
            logger.error('supabase:database', `Error opening activity ${activityId}`, error)
            return { error: error ?? 'No data found' }
        }

        const activity = data.object as Activity

        switch (activity.type) {
            case 'quiz':
                useQuizCreationStore.getState().openQuiz(activityId, activity as Quiz)
                break
            case 'poll':
                usePollCreationStore.getState().openPoll({id: activityId, poll: activity as Poll})
                break
            default:
                logger.error('supabase:database', `Error opening activity ${activityId}`, 'Activity is not a quiz or a poll')
                return { error: 'Activity is not a quiz or a poll' }
        }

        return { error: null }
    }, [])

    return { openActivity, isPending }
}