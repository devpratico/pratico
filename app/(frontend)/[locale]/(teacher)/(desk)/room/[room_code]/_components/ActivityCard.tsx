'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import usePollAnimation, { useSyncedPollAnimation } from '@/app/(frontend)/_stores/usePollAnimation'
import { Button } from '@radix-ui/themes'


interface ActivityCardProps {
    roomId: number
}

/**
 * Listens to the room, detects if there is an activity snapshot, and opens the card if there is.
 * Puts the correct activity animation view in the card.
 */
export default function ActivityCard({ roomId }: ActivityCardProps) {
    useSyncedPollAnimation(roomId) // Sync the usePollAnimation store with the server
    const shouldShowPoll = usePollAnimation(state => state.shouldShowPoll)
    const closePoll = usePollAnimation(state => state.closePoll)
    const handleClickClose = () => {
        closePoll()
    }

    return (
        <CardDialog open={shouldShowPoll}  preventClose>
            <p>Animation!</p>
            <Button onClick={handleClickClose}>Fermer</Button>
        </CardDialog>
    )

}