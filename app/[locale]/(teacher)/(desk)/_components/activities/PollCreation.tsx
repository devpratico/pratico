'use client'
import { Grid, Button, Flex, IconButton, TextField, Container, Section, TextArea, Box, Card } from '@radix-ui/themes'
import { useCallback, useState } from 'react'
import { usePollCreation } from '@/app/_hooks/usePollQuizCreation'
import { saveActivity } from '@/app/api/_actions/activities'
import Title from './Title'
import CancelButton from './CancelButton'
import { PollCreationAnswerRow } from './CreationAnswerRow'
import Navigator from './Navigator'
import { Plus } from 'lucide-react'




export default function PollCreation({ closeDialog }: { closeDialog: () => void }) {
    const {
        poll,
        setTitle,
        idToSaveTo,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        setQuestionText,
        addNewAnswer,
        addEmptyQuestion,
        deleteQuestion,
    } = usePollCreation()

    const [newAnswerText, setNewAnswerText] = useState('')

    const handleAddNewQuestion = useCallback(() => {
        addEmptyQuestion()
        setCurrentQuestionIndex(poll.questions.length)
    }, [addEmptyQuestion, setCurrentQuestionIndex, poll.questions.length])

    const handleSave = useCallback(async () => {
        await saveActivity({ id: idToSaveTo, activity: poll })
        closeDialog()
    }, [poll, closeDialog, idToSaveTo])


    return (
        <Grid rows='auto 1fr auto' height='100%'>

            <Flex justify='between' gap='3' align='center' p='4'>

                <Title type='poll' title={poll.title} onEdit={(newTitle) => setTitle(newTitle)} />

                <Flex gap='3' align='baseline'>
                    <CancelButton onCancel={closeDialog} />
                    <Button variant='soft' onClick={handleSave}>Terminer</Button>
                </Flex>
            </Flex>

            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

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
                            <PollCreationAnswerRow key={index} answerIndex={index} />
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
                                    addNewAnswer({ questionIndex: currentQuestionIndex, answer: { text: newAnswerText } });
                                    setNewAnswerText('');
                                }}
                            ><Plus /></IconButton>
                        </Flex>



                    </Flex>

                </Section>
            </Container>

            <Flex p='3' pt='0' justify='center'>
                <Card variant='classic'>
                    <Flex justify='center' gap='3'>
                        <Navigator total={poll.questions.length} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} />
                        <Button onClick={handleAddNewQuestion}>Nouvelle question</Button>
                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}
