'use client'
import { Poll, PollSnapshot } from "@/app/_types/poll"
import { Container, Section, Grid, Flex, Heading, Button, Card, Dialog, Text, Badge, Box, Switch, VisuallyHidden } from "@radix-ui/themes"
import React, { use, useState, useEffect, useMemo, useCallback, Dispatch, SetStateAction } from "react"
import Navigator from "./Navigator"
import { saveRoomActivitySnapshot } from "@/app/api/_actions/room"
import { useParams } from "next/navigation"
import { usePollSnapshot } from "@/app/_hooks/usePollSnapshot"
import { usePoll } from "@/app/_hooks/usePoll"
import { fetchUser } from "@/app/api/_actions/user"
import logger from "@/app/_utils/logger"



export default function PollAnimation() {
    const {user} = use(fetchUser())
    const { snapshot, isPending, setCurrentQuestionId, setQuestionState, addAnswer, removeAnswer } = usePollSnapshot()
    const { poll } = usePoll()
    const currentQuestionId = useMemo(() => snapshot?.currentQuestionId, [snapshot])

    const currentQuestionIndex = useMemo(() => {
        return currentQuestionId ?
        Object.keys(poll.questions).indexOf(currentQuestionId) : undefined
    }, [poll, currentQuestionId])

    const currentQuestionTitle = useMemo(() => {
        return currentQuestionId ? poll.questions[currentQuestionId].text : ''
    }, [poll, currentQuestionId])

    const currentQuestionChoices = useMemo(() => {
        const choicesIds = currentQuestionId ? poll.questions[currentQuestionId].choicesIds : []
        return choicesIds.map(choiceId => poll.choices[choiceId])
    }

    const usersAnswers = useMemo(() => {
        const allAnswersAsArray = Object.values(snapshot?.answers || {})
        const currentQuestionAnswers = allAnswersAsArray.filter(answer => answer.questionId === currentQuestionId)
        return currentQuestionAnswers
    }, [snapshot, currentQuestionId])

    const myAnswers = useMemo(() => {
        if (!user) return []
        return usersAnswers.filter(answer => answer.userId === user.id)
    }, [usersAnswers, user])


    function handleShowAnswer() {
        setQuestionState('results')
    }

    function handleHideAnswer() {
        setQuestionState('answering')
    }

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
                <Dialog.Close><Button variant='soft' color='gray' loading={isPending}>Terminer</Button></Dialog.Close>
            </Flex>


            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>
                    <Heading as='h2' size='5' align='center'>{currentQuestionTitle}</Heading>
                </Section>

                <Section size='1'>
                    <Flex direction='column' gap='3' mt='7' align='stretch'>
                        {
                            currentQuestionId &&
                            poll.questions[currentQuestionId].choices.map((answer, index) => (
                                <PollAnswerRow 
                                    key={`${index}-${answer.text}`}
                                    text={answer.text}
                                    votes={votesArray[index]}
                                    questionState={questionState}
                                    answerState={answersState[index]}
                                    setAnswerState={(value) => setAnswerState(index, value)}
                                />
                            ))
                        }
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
                            total={poll.questions.length}
                            currentQuestionIndex={currentQuestionIndex}
                            setCurrentQuestionIndex={handleSetCurrentQuestionIndex}
                        />

                        <Button size='3' onClick={handleShowAnswer} style={{ display: questionState == 'results' ? 'none' : 'flex' }}>
                            Voir les résultats
                        </Button>

                        <Button size='3' onClick={handleHideAnswer} style={{ display: questionState == 'results' ? 'flex' : 'none' }} variant='soft'>
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


