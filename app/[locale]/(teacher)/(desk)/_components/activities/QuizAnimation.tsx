'use client'
import { Container, Section, Grid, Flex, Heading, Button, Box, Card, Dialog, VisuallyHidden, Badge } from "@radix-ui/themes"
import {  useMemo,useCallback, useState, useEffect, Dispatch, SetStateAction } from "react"
import Navigator from "./Navigator"
import { fetchUser } from "@/app/api/_actions/user"
import { useQuizSnapshot } from "@/app/_hooks/useQuizSnapshot"
import logger from "@/app/_utils/logger"
import { fetchActivity } from "@/app/api/_actions/activities"
import { Quiz } from "@/app/_types/quiz"
import { emptyQuiz } from "@/app/_hooks/useQuiz"


export default function QuizAnimation() {
    const { snapshot, isPending, setCurrentQuestionId, setQuestionState, addAnswer, removeAnswer } = useQuizSnapshot()
    const currentQuestionId = useMemo(() => snapshot?.currentQuestionId, [snapshot])
    const [quiz, setQuiz] = useState<Quiz>(emptyQuiz)
    const [userId, setUserId] = useState<string | undefined>(undefined)

    // Fetch the quiz object from the database
    useEffect(() => {
        if (snapshot) {
            fetchActivity(snapshot.activityId).then(({data, error}) => {
                if (data?.type === 'quiz') {
                    setQuiz(data.object as Quiz)
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
            Object.keys(quiz.questions).indexOf(currentQuestionId) : undefined
    }, [quiz, currentQuestionId])

    const currentQuestionTitle = useMemo(() => {
        return currentQuestionId ? quiz.questions[currentQuestionId].text : ''
    }, [quiz, currentQuestionId])

    const currentQuestionState = useMemo(() => {
        return snapshot?.currentQuestionState || 'answering'
    }, [snapshot])

    const currentQuestionChoicesIds = useMemo(() => {
        return currentQuestionId ? quiz.questions[currentQuestionId].choicesIds : []
    }, [quiz, currentQuestionId])

    const currentQuestionChoices = useMemo(() => {
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

    const handleSetCurrentQuestionIndex: Dispatch<SetStateAction<number>> = useCallback((index) => {
        setQuestionState('answering')

        if (typeof index === 'number') {
            setCurrentQuestionId(Object.keys(quiz.questions)[index])
        } else { // Index is a function that needs the prev (current) value to give us the new value.
            if (currentQuestionIndex) {
                setCurrentQuestionId(Object.keys(quiz.questions)[index(currentQuestionIndex)])
            } else {
                logger.log('react:component', 'QuizAnimation', 'handleSetCurrentQuestionIndex', 'currentQuestionIndex is undefined')
            }
        }
    }, [quiz, currentQuestionIndex, setCurrentQuestionId, setQuestionState])
    
    return (
        <Grid rows='auto 1fr auto' height='100%'>
            
            <Flex justify='between' gap='3' align='center' p='4'>
                <Dialog.Title size='4' color='gray'>{quiz.title}</Dialog.Title>
                <VisuallyHidden><Dialog.Description>Acticité Quiz</Dialog.Description></VisuallyHidden>
                <Dialog.Close><Button variant='soft' color='gray' loading={isPending}>Terminer</Button></Dialog.Close>
            </Flex>

            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>
                    <Heading as='h2' size='5' align='center'>{currentQuestionTitle}</Heading>
                </Section>

                <Section size='1'>
                    <Flex direction='column' gap='3' mt='7' align='stretch'>
                        {currentQuestionChoices.map((choice, index) => (
                            <QuizAnswerRow
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
                </Section>

            </Container>

            <Flex p='3' pt='0' justify='center'>
                <Card variant='classic'>
                    <Flex justify='center' gap='3'>

                        <Navigator
                            total={Object.keys(quiz.questions).length}
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