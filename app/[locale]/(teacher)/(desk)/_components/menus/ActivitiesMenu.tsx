'use client'
import { Section, Container, Button, Flex, AlertDialog, VisuallyHidden, TextArea, TextField, Checkbox, IconButton, Text, Box } from '@radix-ui/themes'
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import CardDialog from '../CardDialog'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Quiz } from '@/app/_utils/quiz'


interface AnswerRowProps {
    placeholder?: string
    text?: string
    correct?: boolean
    hideOptions?: boolean
}

import { Dispatch, SetStateAction } from 'react';

interface NavigatorProps {
    total: number
    current: number
    setCurrent: Dispatch<SetStateAction<number>>
}


export default function ActivitiesMenu() {
    const [open, setOpen] = useState(false)

    return (

        <Section size='1'>
            <CardDialog trigger={<Button><Plus/>Créer</Button>} preventClose open={open} setOpen={setOpen}>
                <ActivityCreation setOpen={setOpen}/>
            </CardDialog>

        </Section>

    )
}

function ActivityCreation({ setOpen }: { setOpen: (open: boolean) => void }) {

    const testQuiz: Quiz = {
        title: 'Mon super quiz',
        questions: [
            {
                text: 'Quelle est la capitale de la France ?',
                answers: [
                    { text: 'Madrid', correct: false },
                    { text: 'Londres', correct: false },
                    { text: 'Paris', correct: true },
                ]
            },
            {
                text: 'Quel est le plus petit pays du monde ?',
                answers: [
                    { text: 'Monaco', correct: false },
                    { text: 'Le Vatican', correct: true },
                    { text: 'Saint-Marin', correct: false },
                ]
            }
        ]
    }

    const [quiz, setQuiz] = useState<Quiz | undefined>(testQuiz)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    return (
        <Container size='3' px='3'>

            <Section size='1'>

                <Flex justify='between' gap='3' align='center'>

                    <Dialog.Title>{quiz?.title || 'Créer un quiz'}</Dialog.Title>
                    <VisuallyHidden><Dialog.Description>Créez un quiz ou un sondage</Dialog.Description></VisuallyHidden>

                    <Flex gap='3' align='baseline'>
                        <CancelButton onCancel={() => setOpen(false)}/>
                        <Button onClick={() => setOpen(false)}>Terminer</Button>
                    </Flex>
                </Flex>

                <Flex direction='column' gap='3' mt='7' align='stretch'>
                    <TextArea mb='6' placeholder="Question" value={quiz?.questions[currentQuestionIndex].text} />

                    {quiz?.questions[currentQuestionIndex].answers.map((answer, index) => (
                        <AnswerRow key={index} placeholder="Réponse" text={answer.text} correct={answer.correct} />
                    ))}

                    <AnswerRow key={quiz?.questions.length} placeholder="Ajouter une réponse..." hideOptions />

                </Flex>

                <Flex gap='3' align='center' mt='7' width='100%'>
                    <Navigator total={quiz?.questions.length || 0} current={currentQuestionIndex} setCurrent={setCurrentQuestionIndex} />
                    <Button variant='ghost' color='gray'>Supprimer cette question</Button>
                </Flex>

            </Section>
        </Container>
    )
}


function AnswerRow({ placeholder, text, correct, hideOptions }: AnswerRowProps) {
    return (
        <Flex align='center' gap='2' width='100%'>
            <TextField.Root value={text} placeholder={placeholder} style={{width: '100%'}} color={correct ? 'green' : 'red'}/>

            <Flex gap='3' width='100px' justify='between'>

                <Flex as="span" gap="2" display={!hideOptions ? 'flex' : 'none'}>
                    <Checkbox checked={correct} size='3' color={correct ? 'green' : 'red'}/>
                    <Text size='2' color={correct ? 'green' : 'red'}>
                        {correct ? 'Vrai' : 'Faux'}
                    </Text>
                </Flex>

                <Box display={!hideOptions ? 'block' : 'none'}>
                    <IconButton variant='ghost' color='gray'><Trash2 size={18}/></IconButton>
                </Box>

            </Flex>
        </Flex>
    )
}


function Navigator({ total, current, setCurrent }: NavigatorProps) {
    const canGoNext = current < total - 1
    const canGoPrevious = current > 0

    function handleNext() {
        setCurrent((prev) => canGoNext ? prev + 1 : prev)
    }

    function handlePrevious() {
        setCurrent((prev) => canGoPrevious ? prev - 1 : prev)
    }

    return (
        <Flex gap='3' align='center' justify='center' flexGrow='1'>

            <IconButton radius='full' variant='ghost' onClick={handlePrevious} disabled={!canGoPrevious}>
                <ChevronLeft/>
            </IconButton>

            {Array.from({ length: total }).map((_, index) => (
                <Box key={index} width='6px' height='6px' style={{borderRadius: '50%', backgroundColor: index === current ? 'var(--accent-10)' : 'var(--gray-7)'}}/>
            ))}

            {canGoNext ?
                <IconButton radius='full' variant='ghost' onClick={handleNext}>
                    <ChevronRight/>
                </IconButton>
                :
                <Button radius='full'><Plus/>Ajouter une question</Button>
            }

        </Flex>
    )
}




function CancelButton({ onCancel }: { onCancel: () => void }) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button variant='ghost'>Annuler</Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>

                <AlertDialog.Title>Annuler la création</AlertDialog.Title>


                <AlertDialog.Description>
                    Voulez-vous vraiment annuler la création du quiz ? Les modifications seront perdues.
                </AlertDialog.Description>

                <Flex justify='end' gap='3'>
                    <AlertDialog.Cancel>
                        <Button variant='soft' color='red' onClick={onCancel}>Oui, annuler</Button>
                    </AlertDialog.Cancel>

                    <AlertDialog.Action>
                        <Button>Continuer</Button>
                    </AlertDialog.Action>
                </Flex>

            </AlertDialog.Content>
        </AlertDialog.Root> 
    )
}