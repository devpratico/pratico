import { Container, Section, Grid, Flex, Heading, Button, Box, Card, Dialog } from "@radix-ui/themes"
import { useState } from "react"
import Navigator from "./Navigator"
import { Dispatch, SetStateAction } from "react"
import { Quiz } from "@/app/_hooks/usePollQuizCreation"


export default function QuizAnimation({quiz}: {quiz: Quiz}) {
    const [questionState, setQuestionState] = useState<'answering' | 'results'>('answering')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    function handleShowAnswer() {
        setQuestionState('results')
    }

    function handleHideAnswer() {
        setQuestionState('answering')
    }

    const  handleSetCurrentQuestionIndex: Dispatch<SetStateAction<number>> = (index) => {
        setQuestionState('answering')
        setCurrentQuestionIndex(index)
    }
    
    return (
        <Grid rows='auto 1fr auto' height='100%'>
            
            <Flex justify='between' gap='3' align='center' p='4'>
                <Dialog.Title size='4' color='gray'>{quiz.title}</Dialog.Title>
                <Dialog.Close>
                    <Button variant='soft' color='gray'>Terminer</Button>
                </Dialog.Close>
            </Flex>

            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>
                    <Heading as='h2' size='5' align='center'>{quiz.questions[currentQuestionIndex].question.text}</Heading>
                </Section>

                <Section size='1'>
                    <Flex direction='column' gap='3' mt='7' align='stretch'>
                        {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                            <AnswerRow key={index} text={answer.text} correct={answer.correct} questionState={questionState} />
                        ))}
                    </Flex>

                    <Flex justify='center' p="5">
                        <Button size='3' onClick={handleShowAnswer} style={{display: questionState == 'results' ? 'none' : 'block'}}>
                            Montrer la réponse
                        </Button>

                        <Button size='3' onClick={handleHideAnswer} style={{display: questionState == 'results' ? 'block' : 'none'}}>
                            Masquer la réponse
                        </Button>
                    </Flex>

                </Section>

            </Container>

            <Flex p='3' pt='0' justify='center'>
                <Card variant='classic'>
                    <Navigator
                        total={quiz.questions.length}
                        currentQuestionIndex={currentQuestionIndex}
                        setCurrentQuestionIndex={handleSetCurrentQuestionIndex}
                    />
                </Card>
            </Flex>

        </Grid>
    )
}



interface AnswerRowProps {
    text: string
    correct: boolean
    questionState: 'answering' | 'results'
    answerState?: 'selected' | 'unselected'
}




function AnswerRow({ text, correct, questionState, answerState='unselected' }: AnswerRowProps) {
    const [state, setState] = useState<NonNullable<AnswerRowProps['answerState']>>(answerState)

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

    return (
        <Button variant={variant} color={color} onClick={handleClick} style={{justifyContent: 'start'}}>
            {text}
        </Button> 
    )
}