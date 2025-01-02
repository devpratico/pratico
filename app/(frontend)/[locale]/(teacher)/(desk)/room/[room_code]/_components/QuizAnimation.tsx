'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import useQuizAnimation from '@/app/(frontend)/_hooks/stores/useQuizAnimationStore'
import { Button, Box, Badge, Grid, Flex, VisuallyHidden, Heading, Container, Section, Card } from '@radix-ui/themes'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import Navigator from '../../../_components/menus/ActivitiesMenu/components/Navigator'
import { QuizSnapshot } from '@/app/_types/quiz2'
import { useSyncAnimationQuizService, useCloseQuizService, useQuizAnimationService } from '@/app/(frontend)/_hooks/services/useQuizAnimationService'


export default function QuizAnimation() {
    // Sync store state with remote answers
    const { isSyncing, error } = useSyncAnimationQuizService()

    // Store state
    const shouldShowQuiz = useQuizAnimation(state => state.activityId != null)
    const quiz = useQuizAnimation(state => state.quiz)
    const currentQuestionId = useQuizAnimation(state => state.currentQuestionId)
    const currentQuestion = quiz?.questions.find(q => q.id == currentQuestionId)
    const questionState = useQuizAnimation(state => state.state)
    const currentQuestionIndex = quiz?.questions.findIndex(q => q.id == currentQuestionId)
    const answers = useQuizAnimation(state => state.answers)

    // Service methods
    const { close } = useCloseQuizService()
    const { toggleAnswer, setQuestionState, myChoicesIds, setCurrentQuestionIndex } = useQuizAnimationService()


    return (
        <CardDialog open={shouldShowQuiz} preventClose>
            <Grid rows='auto 1fr auto' height='100%'>

                <Flex justify='between' gap='3' align='center' p='4'>
                    <DialogPrimitive.Title asChild><Heading size='4' color="gray">{quiz?.title}</Heading></DialogPrimitive.Title>
                    <VisuallyHidden><DialogPrimitive.Description>Activité quiz</DialogPrimitive.Description></VisuallyHidden>
                    <Button onClick={close} variant='soft' color='gray' disabled={false}>Terminer</Button>
                </Flex>


                <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                    <Section size='1'>
                        <Heading as='h2' size='5' align='center'>{currentQuestion?.text}</Heading>
                    </Section>

                    <Section size='1'>
                        <Flex direction='column' gap='3' mt='7' align='stretch'>
                            {currentQuestion?.choices.map((choice, index) => (
                                <QuizAnswerRow
                                    key={`${index}-${choice.text}`}
                                    text={choice.text}
                                    votes={answers.filter(a => a.choiceId == choice.id).length}
                                    questionState={questionState || 'answering'}
                                    answerState={myChoicesIds.includes(choice.id) ? 'selected' : 'unselected'}
                                    isCorrect={choice.isCorrect}
                                    onClick={() => toggleAnswer(choice.id)}
                                />
                            ))}
                        </Flex>

                        <Flex mt='3' justify='end'>
                            <Badge>{'Nombre de votants : ' + '0'}</Badge>
                        </Flex>

                    </Section>

                </Container>

                <Flex p='3' pt='0' justify='center'>
                    <Card variant='classic'>
                        <Flex justify='center' gap='3'>

                            <Navigator
                                total={quiz?.questions ? Object.keys(quiz.questions).length : 0}
                                currentQuestionIndex={currentQuestionIndex || 0}
                                setCurrentQuestionIndex={setCurrentQuestionIndex}
                            />

                            <Button size='3' onClick={() => setQuestionState('showing results')} style={{ display: questionState == 'showing results' ? 'none' : 'flex' }}>
                                Voir les résultats
                            </Button>

                            <Button size='3' onClick={() => setQuestionState('answering')} style={{ display: questionState == 'showing results' ? 'flex' : 'none' }} variant='soft'>
                                Masquer les résultats
                            </Button>

                        </Flex>
                    </Card>
                </Flex>

            </Grid>
        </CardDialog>
    )
}


interface QuizAnswerRowProps {
    text: string,
    votes: number,
    questionState: QuizSnapshot['state']
    answerState: 'selected' | 'unselected'
    isCorrect: boolean
    onClick: () => void
}

export function QuizAnswerRow({ text, votes, questionState, answerState = 'unselected', isCorrect, onClick }: QuizAnswerRowProps) {

    const isSolid = questionState == 'answering' && answerState === 'selected'
    const isSoft = questionState == 'showing results'
    const variant = isSolid ? 'solid' : isSoft ? 'soft' : 'outline'
    const color = isCorrect && questionState == 'showing results' ? 'green' : undefined

    function handleClick() {
        if (questionState == 'showing results') return
        onClick()
    }

    return (
        <Button variant={variant} color={color} onClick={handleClick}>
            {text}
            <Box ml='auto'>
                {questionState == 'showing results' && <Badge variant='solid' radius='full'>{votes}</Badge>}
            </Box>
        </Button>
    )
}