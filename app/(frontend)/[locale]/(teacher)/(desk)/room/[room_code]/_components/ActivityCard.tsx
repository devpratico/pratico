'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import { useSyncedPollAnimation } from '@/app/(frontend)/_stores/usePollAnimation'
import { useParams } from 'next/navigation'


/**
 * Listens to the room, detects if there is an activity snapshot, and opens the card if there is.
 * Puts the correct activity animation view in the card.
 */
export default function ActivityCard() {
    const { room_code } = useParams<{ room_code: string }>()


    
    useSyncedPollAnimation(room_code)


    return (
        <CardDialog open={open} onOpenChange={setOpen} preventClose>
            <p>Animation!</p>
        </CardDialog>
    )

}