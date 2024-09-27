'use client'
import { Container, Section, Grid, Flex, Heading, Button, Box, Card, Dialog, VisuallyHidden, Badge } from "@radix-ui/themes"
import {  useMemo,useCallback, useState, useEffect, Dispatch, SetStateAction } from "react"
import Navigator from "./Navigator"
import { useQuizSnapshot } from "@/app/_hooks/useQuizSnapshot"
import logger from "@/app/_utils/logger"
import { Quiz } from "@/app/_types/quiz"
import { useAuth } from "@/app/_hooks/useAuth"
import createClient from "@/supabase/clients/client"
import { useRoom } from "@/app/_hooks/useRoom"
import { saveRoomActivitySnapshot } from "@/app/api/actions/room"



export default function QuizAnimation() {
    const { userId } = useAuth()
    const { room } = useRoom()
    const { snapshot, isPending, setCurrentQuestionId, setQuestionState, addAnswer, removeAnswer } = useQuizSnapshot()
    const [activityId, setActivityId] = useState<number | undefined>(() => snapshot?.activityId)
    const [quiz, setQuiz] = useState<Quiz | undefined>(undefined)

    // Change the activityId when the snapshot changes, if needed
    useEffect(() => {
        if (snapshot?.activityId !== activityId) {
            setActivityId(snapshot?.activityId)
        }
    }, [snapshot, activityId])

    // Fetch the quiz if the activityId changes
    useEffect(() => {
        if (activityId) {
            const supabase = createClient()
            supabase.from('activities').select('*').eq('id', activityId).single().then(({ data, error }) => {
                if (error || !data) {
                    logger.error('supabase:database', 'Error fetching activity', error?.message)
                } else {
                    if (data.type === 'quiz') {
                        setQuiz(data.object as any as Quiz)
                    }
                }
            })
        }
    }, [activityId])

    const currentQuestionId = useMemo(() => snapshot?.currentQuestionId, [snapshot])


    const currentQuestionIndex = useMemo(() => {
        if (!quiz) return undefined
        return currentQuestionId ?
            Object.keys(quiz.questions).indexOf(currentQuestionId) : undefined
    }, [quiz, currentQuestionId])

    const currentQuestionTitle = useMemo(() => {
        if (!quiz) return ''
        return currentQuestionId ? quiz.questions[currentQuestionId].text : ''
    }, [quiz, currentQuestionId])

    const currentQuestionState = useMemo(() => {
        return snapshot?.currentQuestionState || 'answering'
    }, [snapshot])

    const currentQuestionChoicesIds = useMemo(() => {
        if (!quiz) return []
        return currentQuestionId ? quiz.questions[currentQuestionId].choicesIds : []
    }, [quiz, currentQuestionId])

    const currentQuestionChoices = useMemo(() => {
        if (!quiz) return []
        return currentQuestionChoicesIds.map(choiceId => quiz.choices[choiceId])
    }, [quiz, currentQuestionChoicesIds])

    const usersAnswers = useMemo(() => {
        const allAnswersAsArray = Object.values(snapshot?.answers || {})
        const currentQuestionAnswers = allAnswersAsArray.filter(answer => answer.questionId === currentQuestionId)
        return currentQuestionAnswers
    }, [snapshot, currentQuestionId])

    const votesArray = useMemo(() => {
        return currentQuestionChoicesIds.map(choiceId => {
            return usersAnswers.filter(answer => answer.choiceId === choiceId).length
        })
    }, [usersAnswers, currentQuestionChoicesIds])

    const myAnswers = useMemo(() => {
        if (!userId) return []
        return usersAnswers.filter(answer => answer.userId === userId)
    }, [usersAnswers, userId])

    const choicesStates = useMemo(() => {
        return currentQuestionChoicesIds.map(choiceId => {
            return myAnswers.some(answer => answer.choiceId === choiceId) ? 'selected' : 'unselected'
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

    const handleClose = useCallback(async () => {
        const roomId = room?.id
        if (!roomId) return
        await saveRoomActivitySnapshot(roomId, null) // Remove the activity snapshot from the room
    }, [room])

    const handleSetCurrentQuestionIndex: Dispatch<SetStateAction<number>> = useCallback((index) => {
        if (!quiz) return
        //setQuestionState('answering')

        if (typeof index === 'number') {
            setCurrentQuestionId(Object.keys(quiz.questions)[index])
        } else { // Index is a function that needs the prev (current) value to give us the new value.
            if (currentQuestionIndex) {
                setCurrentQuestionId(Object.keys(quiz.questions)[index(currentQuestionIndex)])
            } else {
                logger.log('react:component', 'QuizAnimation', 'handleSetCurrentQuestionIndex', 'currentQuestionIndex is undefined')
            }
        }
    }, [quiz, currentQuestionIndex, setCurrentQuestionId])
    
    return (
        <Grid rows='auto 1fr auto' height='100%'>
            
            <Flex justify='between' gap='3' align='center' p='4'>
                <Dialog.Title size='4' color='gray'>{quiz?.title}</Dialog.Title>
                <VisuallyHidden><Dialog.Description>Activité Quiz</Dialog.Description></VisuallyHidden>
                <Dialog.Close onClick={handleClose}><Button variant='soft' color='gray' disabled={isPending}>Terminer</Button></Dialog.Close>
            </Flex>

            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>
                    <Heading as='h2' size='5' align='center'>{currentQuestionTitle}</Heading>
                </Section>

                <Section size='1'>
                    <Flex direction='column' gap='3' mt='7' align='stretch'>
                        {currentQuestionChoices.map((choice, index) => (
                            <QuizAnswerRow
                                index={index}
                                key={`${index}-${choice.text}`}
                                text={choice.text}
                                votes={votesArray[index]}
                                correct={choice.isCorrect}
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
                            total={quiz?.questions ? Object.keys(quiz.questions).length : 0}
                            currentQuestionIndex={currentQuestionIndex || 0}
                            setCurrentQuestionIndex={handleSetCurrentQuestionIndex}
                        />
                    
                        <Button size='3' onClick={handleShowAnswer} style={{ display: currentQuestionState == 'results' ? 'none' : 'flex' }}>
                            Montrer la réponse
                        </Button>

                        <Button size='3' onClick={handleHideAnswer} style={{ display: currentQuestionState == 'results' ? 'flex' : 'none' }} variant='soft'>
                            Masquer la réponse
                        </Button>
                        
                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}



interface QuizAnswerRowProps {
    index: number,
    text: string
    correct: boolean
    votes: number,
    questionState: 'answering' | 'results'
    answerState?: 'selected' | 'unselected'
    setAnswerState: (value: 'selected' | 'unselected') => void
}




export function QuizAnswerRow({ text, correct, votes, questionState, answerState, setAnswerState }: QuizAnswerRowProps) {
    const isSolid = ( questionState == 'answering' && answerState === 'selected' ) || ( questionState == 'results' && correct)
    const isSoft = ( questionState == 'results' && !correct)
    const variant = isSolid ? 'solid' : isSoft ? 'soft' : 'outline'
    const isGreen = questionState == 'results' && correct
    const isGray = questionState == 'results' && !correct
    const color = isGreen ? 'green' : isGray ? 'gray' : undefined

 

    function handleClick() {
        if (questionState == 'results') return
        setAnswerState(answerState === 'selected' ? 'unselected' : 'selected')
    }

    return (
        <Button variant={variant} color={color} onClick={handleClick} style={{justifyContent: 'start'}}>
            {text}
            <Box ml='auto'>
                {questionState == 'results' && <Badge variant='solid' radius='full'>{votes}</Badge>}
            </Box>
        </Button> 
    )
}