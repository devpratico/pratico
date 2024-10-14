'use client'
import { Grid, Button, Flex, IconButton, TextField, Container, Section, TextArea, Card } from '@radix-ui/themes'
import { useCallback, useState, useMemo } from 'react'
import { useQuiz } from '@/app/(frontend)/_hooks/useQuiz'
import saveActivity from '@/app/(backend)/api/activity/save/wrapper'
import Title from './Title'
import CancelButton from './CancelButton'
import { QuizCreationChoiceRow } from './CreationChoiceRow'
import Navigator from './Navigator'
import { Plus } from 'lucide-react'
import { QuizChoice } from '@/app/_types/quiz'
import logger from '@/app/_utils/logger'




export default function QuizCreation({ idToSaveTo, closeDialog }: {  idToSaveTo?: number, closeDialog: () => void }) {
    const {
        quiz,
        setTitle,
        addEmptyQuestion,
        addChoice,
        setQuestionText,
        deleteQuestion,
    } = useQuiz()

    const [currentQuestionId, setCurrentQuestionId] = useState(() => Object.keys(quiz.questions)[0])
    const currentQuestionIndex = useMemo(() => Object.keys(quiz.questions).indexOf(currentQuestionId) || 0, [quiz, currentQuestionId])
    const setCurrentQuestionIndex = useCallback((index: number) => setCurrentQuestionId(Object.keys(quiz.questions)[index]), [quiz])
    const [isSaving, setIsSaving] = useState(false)

    const [newAnswerText, setNewAnswerText] = useState('')

    const handleAddNewQuestion = useCallback(() => {
        const { questionId } = addEmptyQuestion()
        //const lastQuestionId = Object.keys(quiz.questions).pop()
        //if (lastQuestionId) setCurrentQuestionId(lastQuestionId)
        setCurrentQuestionId(questionId)
    }, [addEmptyQuestion, setCurrentQuestionId])

    const handleSave = useCallback(async () => {
        logger.log('react:component', 'QuizCreation', 'handleSave', 'saving quiz...')
        setIsSaving(true)
        await saveActivity({id: idToSaveTo, activity: quiz })
        closeDialog()
        setIsSaving(false)
        logger.log('react:component', 'QuizCreation', 'handleSave', 'quiz saved')
    }, [quiz, closeDialog, idToSaveTo])


    return (
        <Grid rows='auto 1fr auto' height='100%'>

            <Flex justify='between' gap='3' align='center' p='4'>

                <Title type='quiz' title={quiz.title} onEdit={(newTitle) => setTitle(newTitle)} />


                <Flex gap='3' align='baseline'>
                    <CancelButton onCancel={closeDialog} />
                    <Button variant='soft' onClick={handleSave} disabled={isSaving}>Terminer</Button>
                </Flex>
            </Flex>


            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>
                <Section size='1'>


                    <Flex direction='column' gap='3' mt='7' align='stretch'>

                        {/* QUESTION TEXT AREA */}
                        <TextArea
                            placeholder="Question"
                            value={quiz.questions[currentQuestionId].text}
                            onChange={(event) => { setQuestionText(currentQuestionId, event.target.value) }}
                        />

                        <Button
                            mb='8'
                            style={{ alignSelf: 'flex-end' }}
                            size='1'
                            variant='soft'
                            color='gray'
                            onClick={() => { deleteQuestion(currentQuestionId) }}
                            disabled={Object.keys(quiz.questions).length <= 1}
                        >Supprimer la question</Button>

                        {/* ANSWERS */}
                        {quiz.questions[currentQuestionId].choicesIds.map((choiceId, index) => (
                            <QuizCreationChoiceRow key={index} questionId={currentQuestionId} choiceId={choiceId} />
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
                                    const newChoice: QuizChoice = { text: newAnswerText, isCorrect: false }
                                    addChoice(currentQuestionId, newChoice)
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
                        <Navigator total={Object.keys(quiz.questions).length} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} />
                        <Button onClick={handleAddNewQuestion}>Nouvelle question</Button>
                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}

