'use client'
import CardDialog from '@/app/[locale]/(teacher)/(desk)/_components/CardDialog'
import { useState, useEffect } from "react"
import { useRoom } from '@/app/_hooks/useRoom'
import QuizAnimation from '../../../_components/activities/QuizAnimation'
import PollAnimation from '../../../_components/activities/PollAnimation'
import { PollProvider } from '@/app/_hooks/usePoll'
import { QuizProvider } from '@/app/_hooks/useQuiz'
import { Activity } from '@/app/_types/activity'
import { fetchActivity } from '@/app/api/_actions/activities'
import logger from '@/app/_utils/logger'
import { Quiz } from '@/app/_types/quiz'
import { Poll } from '@/app/_types/poll'


/**
 * Listens to the room, detects if there is an activity snapshot, and opens the card if there is.
 * Puts the correct activity animation view in the card.
 */
export default function ActivityCard() {
    const [open, setOpen] = useState(false)
    const [activity, setActivity] = useState<Activity | undefined>(undefined)
    const { room } = useRoom()
    const [ActivityAnswering, setActivityAnswering] = useState<JSX.Element | null>(null)

    // Every time room changes, check if there is an activity snapshot and open the card if there is
    useEffect(() => {
        setOpen(!!room?.activity_snapshot)

        async function _fetchActivity() {
            if (!room?.activity_snapshot) return
            const { data, error } = await fetchActivity(room.activity_snapshot.activityId)
            if (!data || error) {
                logger.error('supabase:database', 'Error fetching activity', error)
                return
            }
            const activity = data.object
            setActivity(activity)
        }

        _fetchActivity()
    }, [room])

    useEffect(() => {
        if (!activity) return


        if (activity.type == 'quiz') {
            const quiz = activity as Quiz
            setActivityAnswering(
                <QuizProvider quiz={quiz}><QuizAnimation /></QuizProvider>
            )
            
        } else if (activity.type == 'poll') {
            const poll = activity as Poll
            setActivityAnswering(
                <PollProvider poll={poll}><PollAnimation /></PollProvider>
            )
        }
    }, [activity])


    return (
        <CardDialog open={open} setOpen={setOpen} preventClose>
            {ActivityAnswering}
        </CardDialog>
    )

}