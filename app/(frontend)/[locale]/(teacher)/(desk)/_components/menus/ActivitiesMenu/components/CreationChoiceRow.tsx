'use client'
import { Trash2 } from 'lucide-react'
import { Flex, IconButton, Checkbox, TextField, Text } from '@radix-ui/themes'
import { useMemo } from 'react'
import { usePoll } from '@/app/(frontend)/_hooks/usePoll'
import { useQuiz } from '@/app/(frontend)/_hooks/useQuiz'



export function QuizCreationChoiceRow({ questionId, choiceId }: { questionId: string, choiceId: string }) {
    const { quiz, setChoiceText, setChoiceIsCorrect, deleteChoice } = useQuiz()
    const choice = useMemo(() =>  quiz.choices[choiceId], [quiz, choiceId]);
    const choiceIndex = useMemo(() => quiz.questions[questionId].choicesIds.indexOf(choiceId), [quiz, questionId, choiceId])

    return (
        <Flex align='center' gap='2' width='100%'>
            <TextField.Root
                value={choice.text}
                placeholder={'Réponse ' + (choiceIndex + 1) + '...'}
                style={{ width: '100%' }}
                color={choice.isCorrect ? 'green' : 'red'}
                onChange={(event) => { setChoiceText(choiceId, event.target.value) }}
            />

            <Flex gap='3' justify='between'>

                <Flex as="span" gap="2" width='100px'>

                    <Checkbox
                        checked={choice.isCorrect}
                        onCheckedChange={(checked) => setChoiceIsCorrect(choiceId, !!checked)}
                        size='3'
                        color={choice.isCorrect ? 'green' : 'red'}
                    />

                    <Text size='2' color={choice.isCorrect ? 'green' : 'red'}>
                        {choice.isCorrect ? 'Correct' : 'Incorrect'}
                    </Text>
                </Flex>


                <IconButton
                    variant='ghost'
                    color='gray'
                    onClick={() => { deleteChoice(choiceId) }}
                >
                    <Trash2 />
                </IconButton>


            </Flex>
        </Flex>
    )
}


export function PollCreationChoiceRow({ questionId, choiceId }: { questionId: string, choiceId: string }) {
    const { poll, setChoiceText, deleteChoice } = usePoll()
    const choice = useMemo(() => poll.choices[choiceId], [poll, choiceId]);
    const choiceIndex = useMemo(() => poll.questions[questionId].choicesIds.indexOf(choiceId), [poll, questionId, choiceId])

    return (
        <Flex align='center' gap='2' width='100%'>
            <TextField.Root
                value={choice.text}
                placeholder={'Réponse ' + (choiceIndex + 1) + '...'}
                style={{ width: '100%' }}
                onChange={(event) => { setChoiceText(choiceId, event.target.value) }}
            />

            <Flex gap='3' justify='between'>
                <IconButton
                    variant='ghost'
                    color='gray'
                    onClick={() => { deleteChoice(choiceId) }}
                >
                    <Trash2 />
                </IconButton>
            </Flex>
        </Flex>
    )
}