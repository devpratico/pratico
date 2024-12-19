'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import { ScrollArea } from '@radix-ui/themes'
import { useSyncParticipationPollService } from '@/app/(frontend)/_hooks/services/usePollParticipationService'
import usePollParticipationStore from '@/app/(frontend)/_hooks/stores/usePollParticipationStore'



export default function ActivityCard() {
    const { isSyncing, error } = useSyncParticipationPollService()
    const shouldShowPoll = usePollParticipationStore(state => state.poll !== null)

    return (
        <CardDialog open={shouldShowPoll} preventClose topMargin='0'>
            <ScrollArea>
            {
                <p>Hello</p>
            }
            </ScrollArea>
        </CardDialog>
    )

}