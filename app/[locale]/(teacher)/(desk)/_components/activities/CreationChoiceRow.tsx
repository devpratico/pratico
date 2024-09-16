'use client'
import { Trash2 } from 'lucide-react'
import { Flex, IconButton, Checkbox, TextField, Text } from '@radix-ui/themes'
import { useMemo, useState } from 'react'
//import { usePollCreation, useQuizCreation } from '@/app/_hooks/usePollQuizCreation'
import { usePoll } from '@/app/_hooks/usePoll'
import { useQuiz } from '@/app/_hooks/useQuiz'
import { Quiz } from '@/app/_types/quiz'



export function QuizCreationChoiceRow({ choiceId }: { choiceId: keyof Quiz['choices'] }) {
    const { quiz, setChoiceText, setChoiceIsCorrect, deleteChoice } = useQuiz()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const choice = useMemo(() =>  quiz.choices[choiceId], [quiz, choiceId]);

    return (
        <Flex align='center' gap='2' width='100%'>
            <TextField.Root
                value={choice.text}
                placeholder={'Réponse ' + (choiceIndex + 1) + '...'}
                style={{ width: '100%' }}
                color={answer.correct ? 'green' : 'red'}
                onChange={(event) => { setAnswerText({ questionIndex: currentQuestionIndex, answerIndex, text: event.target.value }) }}
            />

            <Flex gap='3' justify='between'>

                <Flex as="span" gap="2" width='100px'>

                    <Checkbox
                        checked={answer.correct}
                        onCheckedChange={(checked) => setAnswerCorrect({
                            questionIndex: currentQuestionIndex,
                            answerIndex,
                            correct: !!checked
                        })}
                        size='3'
                        color={answer.correct ? 'green' : 'red'}
                    />

                    <Text size='2' color={answer.correct ? 'green' : 'red'}>
                        {answer.correct ? 'Correct' : 'Incorrect'}
                    </Text>
                </Flex>


                <IconButton
                    variant='ghost'
                    color='gray'
                    onClick={() => { deleteAnswer({ questionIndex: currentQuestionIndex, answerIndex }) }}
                >
                    <Trash2 />
                </IconButton>


            </Flex>
        </Flex>
    )
}


export function PollCreationChoiceRow({ answerIndex }: { answerIndex: number }) {
    const { poll, currentQuestionIndex, setAnswerText, deleteAnswer } = usePollCreation()
    const answer = useMemo(() => poll.questions[currentQuestionIndex].answers[answerIndex], [poll, currentQuestionIndex, answerIndex])

    return (
        <Flex align='center' gap='2' width='100%'>
            <TextField.Root
                value={answer.text}
                placeholder={'Réponse ' + (answerIndex + 1) + '...'}
                style={{ width: '100%' }}
                onChange={(event) => { setAnswerText({ questionIndex: currentQuestionIndex, answerIndex, text: event.target.value }) }}
            />

            <Flex gap='3' justify='between'>
                <IconButton
                    variant='ghost'
                    color='gray'
                    onClick={() => { deleteAnswer({ questionIndex: currentQuestionIndex, answerIndex }) }}
                >
                    <Trash2 />
                </IconButton>
            </Flex>
        </Flex>
    )
}