'use client'
import { Container, Section, Grid, Flex, Heading, Button, Card, Dialog, Badge, Box, VisuallyHidden } from "@radix-ui/themes"
import React, { useMemo, useCallback, Dispatch, SetStateAction, useState, useEffect } from "react"
import Navigator from "./Navigator"
import { usePollSnapshot } from "@/app/_hooks/usePollSnapshot"
import { emptyPoll } from "@/app/_hooks/usePoll"
import { fetchUser } from "@/app/api/_actions/user"
import logger from "@/app/_utils/logger"
import { saveRoomActivitySnapshot } from "@/app/api/_actions/room"
import { useRoom } from "@/app/_hooks/useRoom"
import { Poll } from "@/app/_types/poll"
import { fetchActivity } from "@/app/api/_actions/activities"



export default function PollAnimation() {
    const { snapshot, isPending, setCurrentQuestionId, setQuestionState, addAnswer, removeAnswer } = usePollSnapshot()
    const currentQuestionId = useMemo(() => snapshot?.currentQuestionId, [snapshot])
    const { room } = useRoom()
    const [poll, setPoll] = useState<Poll>(emptyPoll)
    const [ userId, setUserId ] = useState<string | undefined>(undefined)

    // Fetch the poll object from the database
    useEffect(() => {
        if (snapshot) {
            fetchActivity(snapshot.activityId).then(({data, error}) => {
                if (data?.type === 'poll') {
                    setPoll(data.object as Poll)
                }
            })
        }
    }, [snapshot])

    // Fetch userId
    useEffect(() => {
        fetchUser().then(({user, error}) => {
            if (user) {
                setUserId(user.id)
            }
        })
    }, [])

    

    const currentQuestionIndex = useMemo(() => {
        return currentQuestionId ?
        Object.keys(poll.questions).indexOf(currentQuestionId) : undefined
    }, [poll, currentQuestionId])

    const currentQuestionTitle = useMemo(() => {
        return currentQuestionId ? poll.questions[currentQuestionId]?.text : ''
    }, [poll, currentQuestionId])

    const currentQuestionState = useMemo(() => {
        return snapshot?.currentQuestionState || 'answering'
    }, [snapshot])

    const currentQuestionChoicesIds: string[] = useMemo(() => {
        return currentQuestionId ? poll.questions[currentQuestionId]?.choicesIds : []
    }, [poll, currentQuestionId])

    const currentQuestionChoices = useMemo(() => {
        if (!currentQuestionChoicesIds || currentQuestionChoicesIds.length === 0) return []
        return currentQuestionChoicesIds.map(choiceId => poll.choices[choiceId])
    }, [poll, currentQuestionChoicesIds])
        
    const usersAnswers = useMemo(() => {
        const allAnswersAsArray = Object.values(snapshot?.answers || {})
        const currentQuestionAnswers = allAnswersAsArray.filter(answer => answer.questionId === currentQuestionId)
        return currentQuestionAnswers
    }, [snapshot, currentQuestionId])

    const votesArray = useMemo(() => {
        if (!currentQuestionChoicesIds || currentQuestionChoicesIds.length === 0) return []
        return currentQuestionChoicesIds.map(choiceId => {
            return usersAnswers.filter(answer => answer.choiceId === choiceId)?.length || 0
        })
    }, [usersAnswers, currentQuestionChoicesIds])

    const myAnswers = useMemo(() => {
        if (!userId) return []
        return usersAnswers.filter(answer => answer.userId === userId)
    }, [usersAnswers, userId])

    const choicesStates = useMemo(() => {
        if (!currentQuestionChoicesIds || currentQuestionChoicesIds.length === 0) return []
        return currentQuestionChoicesIds.map(choiceId => {
            return myAnswers.some(answer => answer.choiceId === choiceId) ? 'selected' : 'unselected'
            //return 'unselected'
        })
    }, [myAnswers, currentQuestionChoicesIds])

    const setAnswerState = useCallback((index: number, value: 'selected' | 'unselected') => {
        if (!currentQuestionId) return
        const choiceId = currentQuestionChoicesIds[index]
        if (value === 'selected') {
            addAnswer(currentQuestionId, choiceId)
        } else {
            const answer = myAnswers.find(answer => answer.choiceId === choiceId)
            const answerId = snapshot?.answers ? Object.keys(snapshot.answers).find(key => snapshot.answers[key] === answer) : undefined
            if (answerId) {
                removeAnswer(answerId)
            }
        }
    }, [currentQuestionId, currentQuestionChoicesIds, addAnswer, removeAnswer, myAnswers, snapshot])


    function handleShowAnswer() {
        setQuestionState('results')
    }

    function handleHideAnswer() {
        setQuestionState('answering')
    }

    const handleClose = useCallback(() => {
        const roomCode = room?.code
        if (!roomCode) return
        saveRoomActivitySnapshot(roomCode, null) // Remove the activity snapshot from the room
    }, [room])

    const handleSetCurrentQuestionIndex: Dispatch<SetStateAction<number>> = useCallback((index) => {
        setQuestionState('answering')

        if (typeof index === 'number') {
            setCurrentQuestionId(Object.keys(poll.questions)[index])
        } else { // Index is a function that needs the prev (current) value to give us the new value.
            if (currentQuestionIndex) {
                setCurrentQuestionId(Object.keys(poll.questions)[index(currentQuestionIndex)])
            } else {
                logger.log('react:component', 'PollAnimation', 'handleSetCurrentQuestionIndex', 'currentQuestionIndex is undefined')
            }
        }
    }, [poll, currentQuestionIndex, setCurrentQuestionId, setQuestionState])


    return (
        <Grid rows='auto 1fr auto' height='100%'>

            <Flex justify='between' gap='3' align='center' p='4'>
                <Dialog.Title size='4' color='gray'>{poll.title}</Dialog.Title>
                <VisuallyHidden><Dialog.Description>Activité sondage</Dialog.Description></VisuallyHidden>
                <Dialog.Close onClick={handleClose}><Button variant='soft' color='gray' loading={isPending}>Terminer</Button></Dialog.Close>
            </Flex>


            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>
                    <Heading as='h2' size='5' align='center'>{currentQuestionTitle}</Heading>
                </Section>

                <Section size='1'>
                    <Flex direction='column' gap='3' mt='7' align='stretch'>
                        {currentQuestionChoices.map((choice, index) => (
                            <PollAnswerRow 
                                key={`${index}-${choice.text}`}
                                text={choice.text}
                                votes={votesArray[index]}
                                questionState={currentQuestionState}
                                answerState={choicesStates[index]}
                                setAnswerState={(value) => setAnswerState(index, value)}
                            />
                        ))}
                    </Flex>

                    <Flex mt='3' justify='end'>
                        <Badge>{'Nombre de votants : ' + votesArray.reduce((acc, curr) => acc + curr, 0)}</Badge>
                    </Flex>

                </Section>

            </Container>

            <Flex p='3' pt='0' justify='center'>
                <Card variant='classic'>
                    <Flex justify='center' gap='3'>

                        <Navigator
                            total={Object.keys(poll.questions)?.length || 0}
                            currentQuestionIndex={currentQuestionIndex || 0}
                            setCurrentQuestionIndex={handleSetCurrentQuestionIndex}
                        />

                        <Button size='3' onClick={handleShowAnswer} style={{ display: currentQuestionState == 'results' ? 'none' : 'flex' }}>
                            Voir les résultats
                        </Button>

                        <Button size='3' onClick={handleHideAnswer} style={{ display: currentQuestionState == 'results' ? 'flex' : 'none' }} variant='soft'>
                            Masquer les résultats
                        </Button>

                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}


interface PollAnswerRowProps {
    text: string,
    votes: number,
    questionState: 'answering' | 'results'
    answerState?: 'selected' | 'unselected'
    setAnswerState: (value: 'selected' | 'unselected') => void
}

export function PollAnswerRow({ text, votes, questionState, answerState='unselected', setAnswerState }: PollAnswerRowProps) {

    const isSolid = questionState == 'answering' && answerState === 'selected'
    const isSoft = questionState == 'results'
    const variant = isSolid ? 'solid' : isSoft ? 'soft' : 'outline'


    function handleClick() {
        if (questionState == 'results') return
        setAnswerState(answerState === 'selected' ? 'unselected' : 'selected')
    }

    return (
        <Button variant={variant} onClick={handleClick}>
            {text}
            <Box ml='auto'>
                {questionState == 'results' && <Badge variant='solid' radius='full'>{votes}</Badge>}
            </Box>
        </Button>
    )
}


