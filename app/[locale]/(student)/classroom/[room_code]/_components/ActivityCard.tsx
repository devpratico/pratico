'use client'
import CardDialog from '@/app/[locale]/(teacher)/(desk)/_components/CardDialog'
import QuizAnswering from './QuizAnswering'
import { useState, useEffect, useMemo } from "react"
import { useRoom } from '@/app/_hooks/useRoom'
import PollAnswering from './PollAnswering'

export default function ActivityCard() {
    const [open, setOpen] = useState(false)
    const { room } = useRoom()
    const activityType = useMemo(() => room?.activity_snapshot?.type, [room])

    // Every time room changes, check if there is an activity snapshot and open the card if there is
    useEffect(() => {
        setOpen(!!room?.activity_snapshot)
    }, [room])

    let activityAnswering: JSX.Element

    return (
        <CardDialog open={open} setOpen={setOpen} preventClose topMargin='0'>
            {
                activityType == 'quiz' ? <QuizAnswering />
                :
                activityType == 'poll' ? <PollAnswering />
                :
                <p>{'Unknown activity type: ' + activityType}</p>
            }
        </CardDialog>
    )

}