'use client'
import { Container, Section, Dialog, Flex } from "@radix-ui/themes"
import { Poll, PollSnapshot } from "@/app/_types/poll"
import { PollAnswerRow } from "@/app/[locale]/(teacher)/(desk)/_components/activities/PollAnimation"
import { useRoom } from "@/app/_hooks/useRoom"
import { useState, useEffect } from 'react'
import { saveRoomActivitySnapshot } from "@/app/api/_actions/room"


export default function PollAnswering({ poll }: { poll: Poll }) {
    const { room } = useRoom()
    const currentQuestionIndex = room?.activity_snapshot?.currentQuestionIndex || 0
    const questionState = room?.activity_snapshot?.currentQuestionState || 'answering'
    const snapshot = room?.activity_snapshot as (PollSnapshot | null)

    const [answersState, setAnswersState] = useState<('selected' | 'unselected')[]>(() => poll.questions[currentQuestionIndex].answers.map(() => 'unselected')) // The state of each answer (selected or unselected)
    const [newVotesArray, setNewVotesArray] = useState<number[]>(() => snapshot?.votes || poll.questions[currentQuestionIndex].answers.map(() => 0)) // The number of votes for each answer

    
    useEffect(() => {
        if (!room || !snapshot) return
        if (JSON.stringify(newVotesArray) !== JSON.stringify(snapshot?.votes)) {
            saveRoomActivitySnapshot(room.id, { ...snapshot, votes: newVotesArray })
        }
    }, [newVotesArray, room, snapshot])

    

    if (!room || !snapshot) return <p>Pas de session en cours</p>



    // When selecting an answer, deselect all other answers, and update the votesArray
    async function setAnswerState(index: number, value: 'selected' | 'unselected') {
        if (questionState === 'results') return
        if (!snapshot) return

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

            const votesArray = snapshot.votes
            const newVotesArray = votesArray.map((votes, i) => votes + diffMatrix[i])
            setNewVotesArray(newVotesArray)

            return newAnswersState
        })
    }

    

    return (
        <Container size='2' px='3' maxHeight='100%' overflow='scroll'>
            <Section size='2'>
                <Dialog.Title align='center'>{poll.questions[currentQuestionIndex].text}</Dialog.Title>
            </Section>

            <Section size='2'>
                <Flex direction='column' gap='3' mt='7' align='stretch'>
                    {poll.questions[currentQuestionIndex].answers.map((answer, index) => (
                        <PollAnswerRow
                            key={`${index}-${answer.text}`}
                            text={answer.text}
                            votes={snapshot.votes[index]}
                            questionState={questionState}
                            answerState={answersState[index]}
                            setAnswerState={(value) => setAnswerState(index, value)}
                        />
                    ))}
                </Flex>
            </Section>
        </Container>
    )
}