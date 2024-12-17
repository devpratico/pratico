'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import usePollAnimation from '@/app/(frontend)/_hooks/stores/usePollAnimationStore'
import { Button, Box, Badge, Grid, Flex, VisuallyHidden, Heading, Container, Section, Card } from '@radix-ui/themes'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import Navigator from '../../../_components/menus/ActivitiesMenu/components/Navigator'
import { PollSnapshot } from '@/app/_types/poll2'
import { useSyncPollAnimationService } from '@/app/(frontend)/_hooks/services/usePollAnimationService'


interface PollAnimationProps {
    userId: string
}

export default function PollAnimation({  userId }: PollAnimationProps) {
    const { error } = useSyncPollAnimationService() // Sync the usePollAnimation store with the server

    const shouldShowPoll = usePollAnimation(state => state.currentPoll != null)
    const closePoll = usePollAnimation(state => state.closePoll)
    const poll = usePollAnimation(state => state.currentPoll?.poll)
    const currentQuestionId = usePollAnimation(state => state.currentPoll?.currentQuestionId)
    const questionState = usePollAnimation(state => state.currentPoll?.state)
    const changeQuestionState = usePollAnimation(state => state.changeQuestionState)
    const answers = usePollAnimation(state => state.currentPoll?.answers)
    const myAnswers = answers?.filter(a => a.userId == userId)
    const addAnswer = usePollAnimation(state => state.addAnswer)
    const removeAnswer = usePollAnimation(state => state.removeAnswer)

    const currentQuestion = poll?.questions.find(q => q.id == currentQuestionId)
    const currentQuestionIndex = poll?.questions.findIndex(q => q.id == currentQuestionId)
    const setChoiceState = (choiceId: string, state: 'selected' | 'unselected') => {
        if (state == 'selected') {
            if (!currentQuestionId) return
            addAnswer({
                userId: userId,
                questionId: currentQuestionId,
                choiceId: choiceId,
                timestamp: Date.now()
            })
        } else {
            removeAnswer(userId)
        }
    }


    return (
        <CardDialog open={shouldShowPoll} preventClose>
            <Grid rows='auto 1fr auto' height='100%'>

                <Flex justify='between' gap='3' align='center' p='4'>
                    <DialogPrimitive.Title asChild><Heading size='4' color="gray">{poll?.title}</Heading></DialogPrimitive.Title>
                    <VisuallyHidden><DialogPrimitive.Description>Activité sondage</DialogPrimitive.Description></VisuallyHidden>
                    <Button onClick={closePoll} variant='soft' color='gray' disabled={false}>Terminer</Button>
                </Flex>


                <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                    <Section size='1'>
                        <Heading as='h2' size='5' align='center'>{currentQuestion?.text}</Heading>
                    </Section>

                    <Section size='1'>
                        <Flex direction='column' gap='3' mt='7' align='stretch'>
                            {currentQuestion?.choices.map((choice, index) => (
                                <PollAnswerRow
                                    key={`${index}-${choice.text}`}
                                    text={choice.text}
                                    votes={3}
                                    questionState={questionState || 'voting'}
                                    answerState={myAnswers?.some(a => a.choiceId == choice.id) ? 'selected' : 'unselected'}
                                    setAnswerState={(value) => setChoiceState(choice.id, value)}
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
                                total={poll?.questions ? Object.keys(poll.questions).length : 0}
                                currentQuestionIndex={currentQuestionIndex || 0}
                                setCurrentQuestionIndex={() => {}}
                            />

                            <Button size='3' onClick={() => changeQuestionState('showing results')} style={{ display: questionState == 'showing results' ? 'none' : 'flex' }}>
                                Voir les résultats
                            </Button>

                            <Button size='3' onClick={() => changeQuestionState('voting')} style={{ display: questionState == 'showing results' ? 'flex' : 'none' }} variant='soft'>
                                Masquer les résultats
                            </Button>

                        </Flex>
                    </Card>
                </Flex>

            </Grid>
        </CardDialog>
    )
}


interface PollAnswerRowProps {
    text: string,
    votes: number,
    questionState: PollSnapshot['state']
    answerState: 'selected' | 'unselected'
    setAnswerState: (value: 'selected' | 'unselected') => void
}

export function PollAnswerRow({ text, votes, questionState, answerState = 'unselected', setAnswerState }: PollAnswerRowProps) {

    const isSolid = questionState == 'voting' && answerState === 'selected'
    const isSoft = questionState == 'showing results'
    const variant = isSolid ? 'solid' : isSoft ? 'soft' : 'outline'


    function handleClick() {
        if (questionState == 'showing results') return
        setAnswerState(answerState == 'selected' ? 'unselected' : 'selected')
    }

    return (
        <Button variant={variant} onClick={handleClick}>
            {text}
            <Box ml='auto'>
                {questionState == 'showing results' && <Badge variant='solid' radius='full'>{votes}</Badge>}
            </Box>
        </Button>
    )
}