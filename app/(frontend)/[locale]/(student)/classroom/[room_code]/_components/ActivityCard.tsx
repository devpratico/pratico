'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import { ScrollArea } from '@radix-ui/themes'
import { useSyncParticipationPollService } from '@/app/(frontend)/_hooks/services/usePollParticipationService'
import usePollParticipationStore from '@/app/(frontend)/_hooks/stores/usePollParticipationStore'
import PollAnswering from './PollAnswering'



export default function ActivityCard() {
    const { isSyncing, error } = useSyncParticipationPollService()
    const shouldShowPoll = usePollParticipationStore(state => state.poll !== null)
    const shouldShowCard = shouldShowPoll // || shouldShowQuiz

    return (
        <CardDialog open={shouldShowCard} preventClose topMargin='0'>
            <ScrollArea>
            {
                <PollAnswering />
            }
            </ScrollArea>
        </CardDialog>
    )

}