'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import { useState, useEffect, useMemo } from "react"
import { useRoom } from '@/app/(frontend)/_hooks/useRoom'
import QuizAnimation from '../../../_components/menus/ActivitiesMenu/components/QuizAnimation'
import PollAnimation from '../../../_components/menus/ActivitiesMenu/components/PollAnimation'
import { useFullscreen } from '@/app/(frontend)/_hooks/useFullscreen'


/**
 * Listens to the room, detects if there is an activity snapshot, and opens the card if there is.
 * Puts the correct activity animation view in the card.
 */
export default function ActivityCard() {
    const [open, setOpen] = useState(false)
    const { room } = useRoom()
    const activityType = useMemo(() => room?.activity_snapshot?.type, [room])
    // Every time room changes, check if there is an activity snapshot and open the card if there is
    useEffect(() => {
        setOpen(!!room?.activity_snapshot)
		// if (open)
		// 	setActivityOn(true);
		// else
		// 	setActivityOn(false);
    }, [room, open])

    return (
        <CardDialog open={open} onOpenChange={setOpen} preventClose>
            {
                activityType == 'quiz' ? <QuizAnimation />
                :
                activityType == 'poll' ? <PollAnimation />
                :
                <p>{'Unknown activity type: ' + activityType}</p>
            }
        </CardDialog>
    )

}