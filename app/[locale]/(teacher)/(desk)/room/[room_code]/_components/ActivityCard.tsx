'use client'
import CardDialog from '@/app/[locale]/(teacher)/(desk)/_components/CardDialog'
import { useState, useEffect, useMemo, use } from "react"
import { useRoom } from '@/app/_hooks/useRoom'
import QuizAnimation from '../../../_components/activities/QuizAnimation'
import PollAnimation from '../../../_components/activities/PollAnimation'

/**
 * Listens to the room, detects if there is an activity snapshot, and opens the card if there is.
 * Puts the correct activity animation view in the card.
 */
export default function ActivityCard() {
    const [open, setOpen] = useState(false)
    const { room } = useRoom()

    // Every time room changes, check if there is an activity snapshot and open the card if there is
    useEffect(() => {
        setOpen(!!room?.activity_snapshot)
    }, [room])


    let activityAnswering: JSX.Element

    switch (room?.activity_snapshot?.type) {
        case 'quiz':
            activityAnswering = <QuizAnimation />
            break
        case 'poll':
            activityAnswering = <PollAnimation />
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