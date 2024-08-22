'use client'
import { Section, Container, Button, Flex, AlertDialog, VisuallyHidden, TextArea, TextField, Checkbox, IconButton, Text, Box, ScrollArea, Switch, Heading, Callout, Separator, Em } from '@radix-ui/themes'
import { Plus, Trash2, ChevronLeft, ChevronRight, Star, Clock } from 'lucide-react'
import CardDialog from '../CardDialog'
import * as Dialog from '@radix-ui/react-dialog'
import { useState, useMemo } from 'react'
import { QuizCreationProvider, useQuizCreation, testQuiz, testPoll, PollCreationProvider, usePollCreation } from '@/app/_hooks/usePollQuizCreation'


export default function ActivitiesMenu() {
    const [openQuizCreation, setOpenQuizCreation] = useState(false)
    const [openPollCreation, setOpenPollCreation] = useState(false)

    return (
        <>
            <Section size='1'>
                <Flex align='center' gap='2'>
                    <Star size={18}/><Heading size='3' trim='end'>Favoris</Heading>
                </Flex>
                <EmptyCallout message="Aucun favori" mt='2'/>
            </Section>




            <Section size='1'>
                <Flex align='center' gap='2'>
                    <Clock size={18}/><Heading size='3' trim='end'>Récents</Heading>
                </Flex>
                <EmptyCallout message="Aucun élément récent" mt='2' />
            </Section>


            <Separator size='4' my='5'/>


            <Section size='1'>

                <Flex justify='between' align='center' gap='3'>
                    <Heading size='3'>Quiz</Heading>
                    <CardDialog trigger={<Button size='1'><Plus size={18}/>Créer un quiz</Button>} preventClose open={openQuizCreation} setOpen={setOpenQuizCreation}>
                        <QuizCreationProvider initialQuiz={testQuiz}>
                            <QuizCreation closeDialog={() => setOpenQuizCreation(false)} />
                        </QuizCreationProvider>
                    </CardDialog>
                </Flex>


                <EmptyCallout message="Aucun quiz" mt='2' />

                <Flex justify='end' mt='1'>
                    <Button variant='ghost' disabled>Voir tout</Button>
                </Flex>

                
            </Section>




            <Section size='1'>

                <Flex justify='between' align='center' gap='3'>
                    <Heading size='3'>Sondages</Heading>
                    <CardDialog trigger={<Button size='1'><Plus size={18} />Créer un sondage</Button>} open={openPollCreation} setOpen={setOpenPollCreation}>
                        <PollCreationProvider initialPoll={testPoll}>
                            <PollCreation closeDialog={() => setOpenPollCreation(false)} />
                        </PollCreationProvider>
                    </CardDialog>
                </Flex>

                <EmptyCallout message="Aucun sondage" mt='2' />

                <Flex justify='end' mt='1'>
                    <Button variant='ghost' disabled>Voir tout</Button>
                </Flex>

            </Section>

        </>
    )
}


function EmptyCallout({ message, ...props }: { message: string } & Callout.RootProps) {
    return (
        <Callout.Root color='gray' {...props}>
            <Callout.Text>{message}</Callout.Text>
        </Callout.Root>
    )
}




function QuizCreation({ closeDialog }: { closeDialog: () => void }) {
    const {
        quiz,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        setQuestionText,
        addNewAnswer,
        addEmptyQuestion,
        deleteQuestion,
    } = useQuizCreation()

    const [newAnswerText, setNewAnswerText] = useState('')


    return (
        <>
            <Flex justify='between' gap='3' align='center' p='4'>
                <Dialog.Title>{quiz.title || 'Quiz sans titre'}</Dialog.Title>
                <VisuallyHidden><Dialog.Description>{quiz.title || 'Quiz sans titre'}</Dialog.Description></VisuallyHidden>

                <Flex gap='3' align='baseline'>
                    <CancelButton onCancel={closeDialog} />
                    <Button onClick={closeDialog}>Terminer</Button>
                </Flex>
            </Flex>

            <Container size='3' px='3'>

                <Section size='1'>

                    <Flex direction='column' gap='3' mt='7' align='stretch'>

                        {/* QUESTION TEXT AREA */}
                        <TextArea
                            placeholder="Question"
                            value={quiz.questions[currentQuestionIndex].question.text}
                            onChange={(event) => {setQuestionText({ questionIndex: currentQuestionIndex, text: event.target.value })}}
                        />

                        <Button
                            mb='8'
                            style={{alignSelf: 'flex-end'}}
                            size='1'
                            variant='soft'
                            color='gray'
                            onClick={() => { deleteQuestion(currentQuestionIndex) }}
                            disabled={quiz.questions.length <= 1}
                        >Supprimer la question</Button>

                        {/* ANSWERS */}
                        {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                            <QuizAnswerRow key={index} answerIndex={index}/>
                        ))}

                        {/* ADD NEW ANSWER AREA*/}
                        <Flex align='center' gap='2' width='100%' mt='7'>
                            <TextField.Root
                                size='3'
                                value={newAnswerText}
                                placeholder="Ajouter une réponse"
                                style={{ width: '100%' }}
                                onChange={(event) => {setNewAnswerText(event.target.value)}}
                            />
                            <IconButton
                                size='3'
                                onClick={() => {
                                    addNewAnswer({ questionIndex: currentQuestionIndex, answer: { text: newAnswerText, correct: false } });
                                    setNewAnswerText('');
                                }}
                            ><Plus/></IconButton>
                        </Flex>

                        

                    </Flex>

                    <Separator size='4' mb='3' mt='8' />

                    <Flex justify='center' gap='3'>
                        <Navigator total={quiz.questions.length} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} />
                        <Button onClick={addEmptyQuestion}>Nouvelle question</Button>
                    </Flex>

                </Section>

            </Container>          

        </>
    )
}




function PollCreation({ closeDialog }: { closeDialog: () => void }) {
    const {
        poll,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        setQuestionText,
        addNewAnswer,
        addEmptyQuestion,
        deleteQuestion,
    } = usePollCreation()

    const [newAnswerText, setNewAnswerText] = useState('')


    return (
        <>
            <Flex justify='between' gap='3' align='center' p='4'>
                <Dialog.Title>{poll.title || 'Sondage sans titre'}</Dialog.Title>
                <VisuallyHidden><Dialog.Description>{poll.title || 'Sondage sans titre'}</Dialog.Description></VisuallyHidden>

                <Flex gap='3' align='baseline'>
                    <CancelButton onCancel={closeDialog} />
                    <Button onClick={closeDialog}>Terminer</Button>
                </Flex>
            </Flex>

            <Container size='3' px='3'>

                <Section size='1'>

                    <Flex direction='column' gap='3' mt='7' align='stretch'>

                        {/* QUESTION TEXT AREA */}
                        <TextArea
                            placeholder="Question"
                            value={poll.questions[currentQuestionIndex].question.text}
                            onChange={(event) => { setQuestionText({ questionIndex: currentQuestionIndex, text: event.target.value }) }}
                        />

                        <Button
                            mb='8'
                            style={{ alignSelf: 'flex-end' }}
                            size='1'
                            variant='soft'
                            color='gray'
                            onClick={() => { deleteQuestion(currentQuestionIndex) }}
                            disabled={poll.questions.length <= 1}
                        >Supprimer la question</Button>

                        {/* ANSWERS */}
                        {poll.questions[currentQuestionIndex].answers.map((answer, index) => (
                            <PollAnswerRow key={index} answerIndex={index} />
                        ))}

                        {/* ADD NEW ANSWER AREA*/}
                        <Flex align='center' gap='2' width='100%' mt='7'>
                            <TextField.Root
                                size='3'
                                value={newAnswerText}
                                placeholder="Ajouter une réponse"
                                style={{ width: '100%' }}
                                onChange={(event) => { setNewAnswerText(event.target.value) }}
                            />
                            <IconButton
                                size='3'
                                onClick={() => {
                                    addNewAnswer({ questionIndex: currentQuestionIndex, answer: { text: newAnswerText} });
                                    setNewAnswerText('');
                                }}
                            ><Plus /></IconButton>
                        </Flex>



                    </Flex>

                    <Separator size='4' mb='3' mt='8' />

                    <Flex justify='center' gap='3'>
                        <Navigator total={poll.questions.length} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} />
                        <Button onClick={addEmptyQuestion}>Nouvelle question</Button>
                    </Flex>

                </Section>

            </Container>

        </>
    )
}














function QuizAnswerRow({ answerIndex }: { answerIndex: number }) {
    const { quiz, currentQuestionIndex, setAnswerText, setAnswerCorrect, deleteAnswer } = useQuizCreation()
    const answer = useMemo(() => quiz.questions[currentQuestionIndex].answers[answerIndex], [quiz, currentQuestionIndex, answerIndex])

    return (
        <Flex align='center' gap='2' width='100%'>
            <TextField.Root
                value={answer.text}
                placeholder={'Réponse ' + (answerIndex + 1) + '...'}
                style={{width: '100%'}}
                color={answer.correct ? 'green' : 'red'}
                onChange={(event) => {setAnswerText({ questionIndex: currentQuestionIndex, answerIndex, text: event.target.value })}}
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
                    onClick={() => {deleteAnswer({ questionIndex: currentQuestionIndex, answerIndex })}}
                >
                    <Trash2 size={18}/>
                </IconButton>


            </Flex>
        </Flex>
    )
}


function PollAnswerRow({ answerIndex }: { answerIndex: number }) {
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
                    <Trash2 size={18} />
                </IconButton>
            </Flex>
        </Flex>
    )
}





interface NavigatorProps {
    total: number
    currentQuestionIndex: number
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
}

function Navigator({ total, currentQuestionIndex, setCurrentQuestionIndex }: NavigatorProps) {
    const canGoNext = currentQuestionIndex < total - 1
    const canGoPrevious = currentQuestionIndex > 0
    function handleNext() { if (canGoNext) setCurrentQuestionIndex((prev) => prev + 1) }
    function handlePrevious() { if (canGoPrevious) setCurrentQuestionIndex((prev) => prev - 1) }

    return (
        <Flex gap='3' align='center' justify='center' flexGrow='1'>

            <IconButton radius='full' variant='ghost' onClick={handlePrevious} disabled={!canGoPrevious} style={{display: total > 1 ? 'flex' : 'none'}}>
                <ChevronLeft/>
            </IconButton>

            {Array.from({ length: total }).map((_, index) => (
                <Box
                    key={index} width='6px' height='6px'
                    style={{borderRadius: '50%', backgroundColor: index === currentQuestionIndex ? 'var(--accent-10)' : 'var(--gray-7)'}}
                    display={total > 1 ? 'block' : 'none'}
                />
            ))}


            <IconButton radius='full' variant='ghost' onClick={handleNext} disabled={!canGoNext} style={{display: total > 1 ? 'flex' : 'none'}}>
                <ChevronRight/>
            </IconButton>
                
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