'use client'
import { Container, Section, Grid, Flex, Heading, Button, Box, Card, Dialog, VisuallyHidden } from "@radix-ui/themes"
import { useState, useEffect, useMemo } from "react"
import Navigator from "./Navigator"
import { Dispatch, SetStateAction } from "react"
import { Quiz } from "@/app/_hooks/usePollQuizCreation"
import { saveRoomActivitySnapshot } from "@/app/api/actions/room"


export default function QuizAnimation({quiz, quizId, roomId}: {quiz: Quiz, quizId: number, roomId: number}) {
    const [loading, setLoading] = useState(false)
    const [questionState, setQuestionState] = useState<'answering' | 'results'>('answering')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const activitySnapshot = useMemo(() => ({
        activityId: quizId,
        currentQuestionIndex: currentQuestionIndex,
        currentQuestionState: questionState
    }), [quizId, currentQuestionIndex, questionState])

    function handleShowAnswer() {
        setQuestionState('results')
    }

    function handleHideAnswer() {
        setQuestionState('answering')
    }

    const handleSetCurrentQuestionIndex: Dispatch<SetStateAction<number>> = (index) => {
        setQuestionState('answering')
        setCurrentQuestionIndex(index)
    }

    async function handleClose() {
        setLoading(true)
        await saveRoomActivitySnapshot(roomId, null)
        setLoading(false)
    }

    useEffect(() => {
        async function _saveRoom() {
            setLoading(true)
            await saveRoomActivitySnapshot(roomId, activitySnapshot)
            setLoading(false)
        }
        _saveRoom()
    }, [roomId, activitySnapshot])
    
    return (
        <Grid rows='auto 1fr auto' height='100%'>
            
            <Flex justify='between' gap='3' align='center' p='4'>
                <Dialog.Title size='4' color='gray'>{quiz.title}</Dialog.Title>
                <VisuallyHidden><Dialog.Description>Acticité Quiz</Dialog.Description></VisuallyHidden>
                <Button variant='soft' color='gray' onClick={handleClose} loading={loading}>Terminer</Button>
            </Flex>

            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>
                    <Heading as='h2' size='5' align='center'>{quiz.questions[currentQuestionIndex].question.text}</Heading>
                </Section>

                <Section size='1'>
                    <Flex direction='column' gap='3' mt='7' align='stretch'>
                        {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                            <QuizAnswerRow key={`${index}_${answer.text}`} index={index} text={answer.text} correct={answer.correct} questionState={questionState} />
                        ))}
                    </Flex>
                </Section>

            </Container>

            <Flex p='3' pt='0' justify='center'>
                <Card variant='classic'>
                    <Flex justify='center' gap='3'>

                        <Navigator
                            total={quiz.questions.length}
                            currentQuestionIndex={currentQuestionIndex}
                            setCurrentQuestionIndex={handleSetCurrentQuestionIndex}
                        />
                    
                        <Button size='3' onClick={handleShowAnswer} style={{ display: questionState == 'results' ? 'none' : 'flex' }}>
                            Montrer la réponse
                        </Button>

                        <Button size='3' onClick={handleHideAnswer} style={{ display: questionState == 'results' ? 'flex' : 'none' }} variant='soft'>
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
    questionState: 'answering' | 'results'
}




export function QuizAnswerRow({ index, text, correct, questionState }: QuizAnswerRowProps) {
    const [state, setState] = useState<'selected' | 'unselected'>('unselected')

    const isSolid = ( questionState == 'answering' && state === 'selected' ) || ( questionState == 'results' && correct)
    const isSoft = ( questionState == 'results' && !correct)
    const variant = isSolid ? 'solid' : isSoft ? 'soft' : 'outline'
    const isGreen = questionState == 'results' && correct
    const isGray = questionState == 'results' && !correct
    const color = isGreen ? 'green' : isGray ? 'gray' : undefined

 

    function handleClick() {
        if (questionState == 'results') return
        setState((prev) => prev === 'selected' ? 'unselected' : 'selected')
    }

    function getIndexLetter() {
        // I don't know how many answers can exist
        if (index < 0 || index > 999) {
          throw new Error('Index must be between 0 and 999');
        }
        let result = '';
        let tmpIndex = index + 1;

        while (tmpIndex > 0) {
            let tmp = (tmpIndex - 1) % 26;
            let charCode = tmp + 65;
            result = String.fromCharCode(charCode) + result;
            tmpIndex = Math.floor((tmpIndex - 1) / 26);
        }
        
        return (result);
    }

    return (
        <Button variant={variant} color={color} onClick={handleClick} style={{justifyContent: 'start'}}>
           <span style={{fontWeight: 'bold'}}>{getIndexLetter()}</span> - {text}
        </Button> 
    )
}