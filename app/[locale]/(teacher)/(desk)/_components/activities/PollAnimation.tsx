'use client'
import { Poll } from "@/app/_hooks/usePollQuizCreation"
import { Container, Section, Grid, Flex, Heading, Button, Card, Dialog, Text, Badge, Box, Switch } from "@radix-ui/themes"
import React, { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react"
import Navigator from "./Navigator"
import { PollSnapshot, saveRoomActivitySnapshot } from "@/app/api/_actions/room"


export default function PollAnimation({ poll, pollId, roomId }: { poll: Poll, pollId: number, roomId: number }) {
    const [questionState, setQuestionState] = useState<'answering' | 'results'>('answering')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [votesArray, setVotesArray] = useState<number[]>(() => poll.questions[currentQuestionIndex].answers.map(() => 0)) // The number of votes for each answer
    const [answersState, setAnswersState] = useState<('selected' | 'unselected')[]>(() => poll.questions[currentQuestionIndex].answers.map(() => 'unselected')) // The state of each answer (selected or unselected)


    // Consolidate the poll state in a single object
    const pollSnapshot: PollSnapshot = useMemo(() => ({
        activityId: pollId,
        currentQuestionIndex,
        currentQuestionState: questionState,
        votes: votesArray
    }), [pollId, currentQuestionIndex, questionState, votesArray])


    // Side effect: when the pollSnapshot changes, save it in Supabase
    useEffect(() => {
        saveRoomActivitySnapshot(roomId, pollSnapshot)
    }, [pollSnapshot, roomId])


    async function handleClose() {
        await saveRoomActivitySnapshot(roomId, null)
    }

    function handleShowAnswer() {
        setQuestionState('results')
    }

    function handleHideAnswer() {
        setQuestionState('answering')
    }

    const handleSetCurrentQuestionIndex: Dispatch<SetStateAction<number>> = (index) => {
        setQuestionState('answering')
        setCurrentQuestionIndex((prev) => {
            const nextIndex = typeof index === 'number' ? index : index(prev)
            setVotesArray(poll.questions[nextIndex].answers.map(() => 0))
            return nextIndex
        })
        setAnswersState(poll.questions[currentQuestionIndex].answers.map(() => 'unselected'))
    }

    // When selecting an answer, deselect all other answers, and update the votesArray
    function setAnswerState(index: number, value: 'selected' | 'unselected') {
        if (questionState === 'results') return

        setAnswersState((prevAnswers) => {
            let newAnswersState: ('selected' | 'unselected')[] = []

            if (value === 'selected') {
                newAnswersState = prevAnswers.map((_, i) => i === index ? 'selected' : 'unselected')
            } else {
                newAnswersState = prevAnswers.map(() => 'unselected')
            }

            const prevAnswersMatrix = prevAnswers.map((state, i) => state === 'selected' ? 1 : 0)
            const newAnswersMatrix = newAnswersState.map((state, i) => state === 'selected' ? 1 : 0)
            const diffMatrix = newAnswersMatrix.map((state, i) => state - prevAnswersMatrix[i])
            setVotesArray(votesArray.map((votes, i) => votes + diffMatrix[i]))

            return newAnswersState
        })
    }

    return (
        <Grid rows='auto 1fr auto' height='100%'>

            <Flex justify='between' gap='3' align='center' p='4'>
                <Dialog.Title size='4' color='gray'>{poll.title}</Dialog.Title>
                <Dialog.Close onClick={handleClose}>
                    <Button variant='soft' color='gray'>Terminer</Button>
                </Dialog.Close>
            </Flex>


            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>
                    <Heading as='h2' size='5' align='center'>{poll.questions[currentQuestionIndex].question.text}</Heading>
                </Section>

                <Section size='1'>
                    <Flex direction='column' gap='3' mt='7' align='stretch'>
                        {poll.questions[currentQuestionIndex].answers.map((answer, index) => (
                            <PollAnswerRow 
                                key={`${index}-${answer.text}`}
                                text={answer.text}
                                votes={votesArray[index]}
                                questionState={questionState}
                                answerState={answersState[index]}
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


