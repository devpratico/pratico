'use client'
import { Container, Section, Dialog, Flex } from "@radix-ui/themes"
//import { useState } from "react"
import { Quiz } from "@/app/_hooks/usePollQuizCreation"
import { QuizAnswerRow } from "@/app/[locale]/(teacher)/(desk)/_components/activities/QuizAnimation"
import { useRoom } from "@/app/_hooks/useRoom"


export default function QuizAnswering({ quiz }: { quiz: Quiz }) {
    const { room } = useRoom() // This will fail in the future when this component will update the room (activity_snapshot)

    if (!room?.activity_snapshot) return <p>Pas de session en cours</p>

    const currentQuestionIndex = room.activity_snapshot.currentQuestionIndex
    const questionState = room.activity_snapshot.currentQuestionState

    return (
        <Container size='2' px='3' maxHeight='100%' overflow='scroll'>
            <Section size='2'>
                <Dialog.Title align='center'>{quiz.questions[currentQuestionIndex].question.text}</Dialog.Title>
            </Section>

            <Section size='2'>
                <Flex direction='column' gap='3' mt='7' align='stretch'>
                    {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                        <QuizAnswerRow key={`${index}_${answer.text}`} questionState={questionState} text={answer.text} correct={answer.correct} />
                    ))}
                </Flex>
            </Section>
        </Container>
    )
}