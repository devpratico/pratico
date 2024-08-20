'use client'
import { Section, Container, Button, Flex, AlertDialog, VisuallyHidden, TextArea, TextField, Checkbox, IconButton, Text, Box, ScrollArea, Switch } from '@radix-ui/themes'
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import CardDialog from '../CardDialog'
import * as Dialog from '@radix-ui/react-dialog'
import { useState, useMemo, use } from 'react'
import { Quiz, QuizCreationProvider, useQuizCreation } from '@/app/_hooks/useQuizCreation'


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

interface AnswerStyle {
    checked: boolean | 'indeterminate',
    color: string,
    text: string
}


export default function ActivitiesMenu() {
    const [open, setOpen] = useState(false)

    return (

        <Section size='1'>
            <CardDialog trigger={<Button><Plus/>Créer</Button>} preventClose open={open} setOpen={setOpen}>
                <QuizCreationProvider initialQuiz={testQuiz}>
                    <ActivityCreation setOpen={setOpen}/>
                </QuizCreationProvider>
            </CardDialog>

        </Section>

    )
}

function ActivityCreation({ setOpen }: { setOpen: (open: boolean) => void }) {
    const {
        quiz,
        currentQuestionIndex,
        setQuestionText,
        setAnswerCorrect,
        addNewAnswer,
        deleteQuestion,
    } = useQuizCreation()

    const [newAnswerText, setNewAnswerText] = useState('')
    const [type, setType] = useState<'quiz' | 'poll'>('quiz')

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

                        {/* QUESTION TEXT AREA */}
                        <TextArea
                            mb='6'
                            placeholder="Question"
                            value={quiz?.questions[currentQuestionIndex].text}
                            onChange={(event) => {setQuestionText({ index: currentQuestionIndex, text: event.target.value })}}
                        />

                        {/* QUIZ/POLL SWITCH  OPTION */}
                        <Flex gap='2' style={{alignSelf:'end'}} display={(quiz?.questions?.[currentQuestionIndex].answers?.length ?? 0) > 0 ? 'flex' : 'none'}>
                            <Switch
                                checked={type === 'quiz'}
                                onCheckedChange={(checked) =>  {
                                    setType(checked ? 'quiz' : 'poll')
                                    // If poll, set all answers 'correctness' to undefined
                                    if (!checked) {
                                        quiz?.questions[currentQuestionIndex].answers.forEach((answer, index) => {
                                            setAnswerCorrect({ questionIndex: currentQuestionIndex, answerIndex: index, correct: undefined })
                                        })
                                    } else {
                                        // If quiz, set all answers 'correctness' to false
                                        quiz?.questions[currentQuestionIndex].answers.forEach((answer, index) => {
                                            setAnswerCorrect({ questionIndex: currentQuestionIndex, answerIndex: index, correct: false })
                                        })
                                    }
                                }
                                }
                            />
                            <Text size='2' color='gray'>{`Vrai/Faux`}</Text>
                        </Flex>

                        {/* ANSWERS */}
                        {quiz?.questions[currentQuestionIndex].answers.map((answer, index) => (
                            <AnswerRow key={index} answerIndex={index} showVraiFaux={type === 'quiz'}/>
                        ))}

                        {/* ADD NEW ANSWER AREA*/}
                        <Flex align='center' gap='2' width='100%' mt='7'>
                            <TextField.Root
                                value={newAnswerText}
                                placeholder="Ajouter une réponse"
                                style={{ width: '100%' }}
                                onChange={(event) => {setNewAnswerText(event.target.value)}}
                            />
                            <Button
                                onClick={() => {
                                    addNewAnswer({ questionIndex: currentQuestionIndex, answer: { text: newAnswerText, correct: false } });
                                    setNewAnswerText('');
                                }}
                            >Ajouter</Button>
                        </Flex>

                        

                    </Flex>

                    <Flex gap='3' align='center' mt='7' width='100%'>
                        <Navigator/>
                        <Button
                            variant='ghost'
                            color='gray'
                            onClick={() => {deleteQuestion(currentQuestionIndex)}}
                        >Supprimer cette question</Button>
                    </Flex>

                </Section>

        </Container>
    )
}


function AnswerRow({ answerIndex, showVraiFaux=true }: { answerIndex: number, showVraiFaux?: boolean }) {
    const { quiz, currentQuestionIndex, setAnswerText, setAnswerCorrect, deleteAnswer } = useQuizCreation()
    const answer = useMemo(() => quiz?.questions[currentQuestionIndex].answers[answerIndex], [quiz, currentQuestionIndex, answerIndex])

    const style: AnswerStyle = useMemo(() => {
        switch (answer?.correct) {
            case true:  return { checked: true, color: 'green', text: 'Vrai' }
            case false: return { checked: false, color: 'red', text: 'Faux' }
            default:    return { checked: 'indeterminate', color: 'gray', text: 'Neutre' }
        }
    },[answer])

    return (
        <Flex align='center' gap='2' width='100%'>
            <TextField.Root
                value={answer?.text}
                placeholder={'Réponse ' + (answerIndex + 1) + '...'}
                style={{width: '100%'}}
                color={style.color as any}
                onChange={(event) => {setAnswerText({ questionIndex: currentQuestionIndex, answerIndex, text: event.target.value })}}
            />

            <Flex gap='3' justify='between'>

                <Flex as="span" gap="2" width='70px' display={showVraiFaux ? 'flex' : 'none'}>

                    <Checkbox
                        checked={style.checked}
                        onCheckedChange={(checked) => setAnswerCorrect({
                            questionIndex: currentQuestionIndex,
                            answerIndex,
                            correct: checked == 'indeterminate' ? undefined : checked
                        })}
                        size='3'
                        color={style.color as any}
                    />

                    <Text size='2' color={style.color as any}>{style.text}</Text>
                </Flex>


                <IconButton
                    variant='ghost'
                    color='gray'
                    onClick={() => {deleteAnswer({ questionIndex: currentQuestionIndex, answerIndex })}}
                >
                    <Trash2 size={18}/>
                </IconButton>


            </Flex>
        </Flex>
    )
}


function Navigator() {
    const { quiz, currentQuestionIndex, setCurrentQuestionIndex, addNewQuestion } = useQuizCreation()
    const total = useMemo(() => quiz?.questions.length || 0, [quiz])
    const canGoNext = currentQuestionIndex < total - 1
    const canGoPrevious = currentQuestionIndex > 0

    function handleNext() {
        if (canGoNext) setCurrentQuestionIndex(currentQuestionIndex + 1)
    }

    function handlePrevious() {
        if (canGoPrevious) setCurrentQuestionIndex(currentQuestionIndex - 1)
    }

    function handleAddQuestion() {
        addNewQuestion()
        setCurrentQuestionIndex(total) // Move to the newly added question
    }

    return (
        <Flex gap='3' align='center' justify='center' flexGrow='1'>

            <IconButton radius='full' variant='ghost' onClick={handlePrevious} disabled={!canGoPrevious}>
                <ChevronLeft/>
            </IconButton>

            {Array.from({ length: total }).map((_, index) => (
                <Box key={index} width='6px' height='6px' style={{borderRadius: '50%', backgroundColor: index === currentQuestionIndex ? 'var(--accent-10)' : 'var(--gray-7)'}}/>
            ))}

            {canGoNext ?
                <IconButton radius='full' variant='ghost' onClick={handleNext}>
                    <ChevronRight/>
                </IconButton>
                :
                <Button radius='full' onClick={handleAddQuestion}><Plus/>Ajouter une question</Button>
            }

        </Flex>
    )
}



/**
 * Button on the top right corner of the dialog
 */
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