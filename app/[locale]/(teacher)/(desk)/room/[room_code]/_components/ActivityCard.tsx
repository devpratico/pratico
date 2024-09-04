'use client'
import CardDialog from '@/app/[locale]/(teacher)/(desk)/_components/CardDialog'
import { useState, useEffect } from "react"
import { useRoom } from '@/app/_hooks/useRoom'
import { Quiz } from '@/app/_types/quiz'
import { Poll } from '@/app/_types/poll'
import { fetchActivity } from '@/app/api/_actions/activities'
import QuizAnimation from '../../../_components/activities/QuizAnimation'
import PollAnimation from '../../../_components/activities/PollAnimation'

export default function ActivityCard() {
    const [open, setOpen] = useState(false)
    const { room } = useRoom()
    const [activity, setActivity] = useState<Quiz | Poll | undefined>(undefined)

    useEffect(() => {
        // Set the activity
        async function _setActivity() {
            if (!room?.activity_snapshot) return
            const { data, error } = await fetchActivity(room.activity_snapshot.activityId)
            if (error || !data) return
            setActivity(data.object)
        }
        
        _setActivity().then(() => {
            // Open the card when an activity is present
            setOpen(!!room?.activity_snapshot)
        })

    }, [room])

    if (!room?.activity_snapshot) return null

    let activityAnswering: JSX.Element

    switch (activity?.type) {
        case 'quiz':
            activityAnswering = <QuizAnimation quiz={activity} quizId={room.activity_snapshot.activityId} roomId={room.id} />
            break
        case 'poll':
            activityAnswering = <PollAnimation poll={activity} pollId={room.activity_snapshot.activityId} roomId={room.id} />
            break
        default:
            activityAnswering = <p>Pas de session en cours</p>
    }

    return (
        <CardDialog open={open} setOpen={setOpen} preventClose>
            {activityAnswering}
        </CardDialog>
    )

}