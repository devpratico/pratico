'use client'
import CardDialog from '@/app/[locale]/(teacher)/(desk)/_components/CardDialog'
import QuizAnswering from './QuizAnswering'
import { useState, useEffect } from "react"
import { useRoom } from '@/app/_hooks/useRoom'
import { Quiz, Poll } from '@/app/_hooks/usePollQuizCreation'
import { fetchActivity } from '@/app/api/_actions/activities'
import PollAnswering from './PollAnswering'

export default function ActivityCard() {
    const [open, setOpen] = useState(false)
    const { room } = useRoom()
    const [activity, setActivity] = useState<Quiz | Poll | undefined>(undefined)

    useEffect(() => {
        // Open the card when an activity is present
        setOpen(!!room?.activity_snapshot)
        // Set the activity
        async function _setActivity() {
            if (!room?.activity_snapshot) return
            const { data, error } = await fetchActivity(room.activity_snapshot.activityId)
            if (error || !data) return
            setActivity(data.object)
        }
        _setActivity()
    }, [room])

    let activityAnswering: JSX.Element

    switch (activity?.type) {
        case 'quiz':
            activityAnswering = <QuizAnswering quiz={activity} />
            break
        case 'poll':
            activityAnswering = <PollAnswering poll={activity} />
            break
        default:
            activityAnswering = <p>Pas de session en cours</p>
    }

    return (
        <CardDialog open={open} setOpen={setOpen} preventClose topMargin='0'>
            {activityAnswering}
        </CardDialog>
    )

}