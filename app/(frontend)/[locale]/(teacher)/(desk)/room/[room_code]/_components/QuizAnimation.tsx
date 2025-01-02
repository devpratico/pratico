'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import useQuizAnimation from '@/app/(frontend)/_hooks/stores/useQuizAnimationStore'
import { useSyncAnimationQuizService } from '@/app/(frontend)/_hooks/services/useQuizAnimationService'


export default function QuizAnimation() {
    // Sync store state with remote answers
    const { isSyncing, error } = useSyncAnimationQuizService()

    // Store state
    const shouldShowQuiz = useQuizAnimation(state => state.activityId != null)

    return (
        <CardDialog open={shouldShowQuiz} preventClose>
            Hello
        </CardDialog>
    )
}