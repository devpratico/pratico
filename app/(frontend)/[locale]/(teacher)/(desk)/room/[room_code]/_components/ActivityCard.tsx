'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import { useState, useEffect, useMemo } from "react"
import { useRoom } from '@/app/(frontend)/_hooks/useRoom'
import QuizAnimation from '../../../_components/activities/QuizAnimation'
import PollAnimation from '../../../_components/activities/PollAnimation'
import { useFullscreen } from '@/app/(frontend)/_hooks/useFullscreen'
import logger from '@/app/_utils/logger'


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
		logger.log("react:component", "ActivityCard", "room changes ?", room, open);
    }, [room, open])

    return (
        <CardDialog open={open} onOpenChange={setOpen} preventClose>
            {
                activityType == 'quiz' ? <QuizAnimation />
                :
                activityType == 'poll' ? <PollAnimation />
                :
                activityType == undefined ? <></>
				: <p>{'Unknown activity type: ' + activityType}</p>
            }
        </CardDialog>
    )

}