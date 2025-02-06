'use client'
import { Container, Section, Flex, Heading, ScrollArea } from "@radix-ui/themes"
import { QuizAnswerRow } from "@/app/(frontend)/[locale]/(teacher)/(desk)/room/[room_code]/_components/QuizAnimation"
import useQuizParticipationStore from "@/app/(frontend)/_hooks/stores/useQuizParticipationStore"
import useQuizParticipationService, { useSyncParticipationQuizService } from "@/app/(frontend)/_hooks/services/useQuizParticipationService"
import CardDialog from "@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog"
import logger from "@/app/_utils/logger"

export default function QuizParticipation() {
    // Sync store state with remote answers
    const { isSyncing, error } = useSyncParticipationQuizService()

    // Store
    const showCard = useQuizParticipationStore(state => state.quiz !== null)
    const quiz = useQuizParticipationStore(state => state.quiz)
    const currentQuestionId = useQuizParticipationStore(state => state.currentQuestionId)
    const questionText = quiz?.questions.find(q => q.id === currentQuestionId)?.text
    const currentQuestionChoices = quiz?.questions.find(q => q.id === currentQuestionId)?.choices || []
    const questionState = useQuizParticipationStore(state => state.state)
    const answers = useQuizParticipationStore(state => state.answers)

    // Service
    const { toggleAnswer, myChoicesIds, isPending } = useQuizParticipationService()

    // const onClick = useCallback(async (e: React.MouseEvent) => {
    //     e.preventDefault(); // Prevent double event triggering
    //     e.stopPropagation(); // Ensure event bubbling isn't the issue
    //     await toggleAnswer(choice.id)
    // }, [])

    return (
        <CardDialog open={showCard} preventClose topMargin='0'>
            <ScrollArea>
                <Container size='2' px='3' maxHeight='100%' overflow='scroll'>
                    <Section size='2'>
                        <Heading align='center'>{questionText}</Heading>
                    </Section>

                    <Section size='2'>
                        <Flex direction='column' gap='3' mt='7' align='stretch'>
                            {currentQuestionChoices.map((choice, index) => (
                                <QuizAnswerRow
                                    key={`${index}-${choice.text}`}
                                    text={choice.text}
                                    isCorrect={choice.isCorrect}
                                    votes={answers.filter(a => a.choiceId === choice.id).length}
                                    questionState={questionState}
                                    answerState={myChoicesIds.includes(choice.id) ? 'selected' : 'unselected'}
                                    //onClick={() => toggleAnswer(choice.id)}
                                    disabled={isPending || isSyncing}
                                    onClick={async (e) => {
                                        e.preventDefault(); // Prevent double event triggering
                                        e.stopPropagation(); // Ensure event bubbling isn't the issue
                                        const { error } = await toggleAnswer(choice.id)
                                        if (error) logger.error(
                                            'react:component',
                                            'QuizParticipation.tsx',
                                            'onClick',
                                            'toggleAnswer',
                                            error
                                        )
                                    }}
                                />
                            ))}
                        </Flex>
                    </Section>
                </Container>
            </ScrollArea>
        </CardDialog>
    )
}