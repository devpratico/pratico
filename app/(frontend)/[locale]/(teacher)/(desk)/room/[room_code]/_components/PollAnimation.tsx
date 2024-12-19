'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import usePollAnimation from '@/app/(frontend)/_hooks/stores/usePollAnimationStore'
import { Button, Box, Badge, Grid, Flex, VisuallyHidden, Heading, Container, Section, Card } from '@radix-ui/themes'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import Navigator from '../../../_components/menus/ActivitiesMenu/components/Navigator'
import { PollSnapshot } from '@/app/_types/poll2'
import { useSyncRemotePollAnswersService, useClosePollService, usePollAnimationService } from '@/app/(frontend)/_hooks/services/usePollAnimationService'


export default function PollAnimation() {
    // Sync store state with remote answers
    const { isSyncing, error } = useSyncRemotePollAnswersService()

    // Store state
    const shouldShowPoll = usePollAnimation(state => state.id != null)
    const poll = usePollAnimation(state => state.poll)
    const currentQuestionId = usePollAnimation(state => state.currentQuestionId)
    const questionState = usePollAnimation(state => state.state)
    const currentQuestion = poll?.questions.find(q => q.id == currentQuestionId)
    const currentQuestionIndex = poll?.questions.findIndex(q => q.id == currentQuestionId)
    
    // Service methods
    const { closePoll } = useClosePollService()
    const { toggleAnswer, setQuestionState, myChoicesIds } = usePollAnimationService()


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
                                    answerState={myChoicesIds.includes(choice.id) ? 'selected' : 'unselected'}
                                    //setAnswerState={(value) => setChoiceState(choice.id, value)}
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
                                total={poll?.questions ? Object.keys(poll.questions).length : 0}
                                currentQuestionIndex={currentQuestionIndex || 0}
                                setCurrentQuestionIndex={() => {}}
                            />

                            <Button size='3' onClick={() => setQuestionState('showing results')} style={{ display: questionState == 'showing results' ? 'none' : 'flex' }}>
                                Voir les résultats
                            </Button>

                            <Button size='3' onClick={() => setQuestionState('voting')} style={{ display: questionState == 'showing results' ? 'flex' : 'none' }} variant='soft'>
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
    //setAnswerState: (value: 'selected' | 'unselected') => void
    onClick: () => void
}

export function PollAnswerRow({ text, votes, questionState, answerState = 'unselected', onClick }: PollAnswerRowProps) {

    const isSolid = questionState == 'voting' && answerState === 'selected'
    const isSoft = questionState == 'showing results'
    const variant = isSolid ? 'solid' : isSoft ? 'soft' : 'outline'


    function handleClick() {
        if (questionState == 'showing results') return
        //setAnswerState(answerState == 'selected' ? 'unselected' : 'selected')
        onClick()
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