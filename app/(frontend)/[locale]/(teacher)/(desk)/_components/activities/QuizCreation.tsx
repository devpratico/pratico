'use client'
import { Grid, Button, Flex, IconButton, TextField, Container, Section, TextArea, Card, Tooltip } from '@radix-ui/themes'
import { useCallback, useState, useMemo } from 'react'
import { useQuiz } from '@/app/(frontend)/_hooks/useQuiz'
import { saveActivity } from '@/app/(backend)/api/activity/activitiy.client'
import Title from './Title'
import CancelButton from './CancelButton'
import { QuizCreationChoiceRow } from './CreationChoiceRow'
import Navigator from './Navigator'
import { Copy, Plus, Trash2 } from 'lucide-react'
import { QuizChoice } from '@/app/_types/quiz'
import logger from '@/app/_utils/logger'
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation'




export default function QuizCreation({ idToSaveTo, closeDialog }: {  idToSaveTo?: number, closeDialog: () => void }) {
    const router = useRouter()
    const {
        quiz,
        setTitle,
        addEmptyQuestion,
        addChoice,
        setQuestionText,
        deleteQuestion,
		duplicateQuestion,
    } = useQuiz()

    const [currentQuestionId, setCurrentQuestionId] = useState(() => Object.keys(quiz.questions)[0])
    const currentQuestionIndex = useMemo(() => Object.keys(quiz.questions).indexOf(currentQuestionId) || 0, [quiz, currentQuestionId])
	const numberOfQuestions = useMemo(() => Object.keys(quiz.questions).length, [quiz.questions]);
    const setCurrentQuestionIndex = useCallback((index: number) => setCurrentQuestionId(Object.keys(quiz.questions)[index]), [quiz])
    const [isSaving, setIsSaving] = useState(false);
    const [newAnswerText, setNewAnswerText] = useState('')

	const deleteIsActive = useMemo(() => {
		if (numberOfQuestions < 2)
			if (quiz.questions[currentQuestionId].text.length === 0 && !quiz.questions[currentQuestionId].choicesIds.length)
				return (false);
		return (true);
	 }, [quiz.questions, currentQuestionId, numberOfQuestions]);

    const handleAddNewQuestion = useCallback(() => {
        const { questionId } = addEmptyQuestion()
        //const lastQuestionId = Object.keys(quiz.questions).pop()
        //if (lastQuestionId) setCurrentQuestionId(lastQuestionId)
		console.log(currentQuestionId, questionId);

		if (currentQuestionId !== questionId)
        	setCurrentQuestionId(questionId);
    }, [addEmptyQuestion, setCurrentQuestionId, currentQuestionId])

	const handleDuplicateQuestion = useCallback(() => {
		const { questionId } = duplicateQuestion(currentQuestionId);

		setCurrentQuestionId(questionId);
    }, [duplicateQuestion, currentQuestionId])

    const handleSave = useCallback(async () => {
        logger.log('react:component', 'QuizCreation', 'handleSave', 'saving quiz...')
        setIsSaving(true)
        await saveActivity({id: idToSaveTo, activity: quiz })
        closeDialog()
        setIsSaving(false)
        logger.log('react:component', 'QuizCreation', 'handleSave', 'quiz saved')
        router.refresh()
    }, [quiz, closeDialog, idToSaveTo, router])

	const handleDelete = useCallback(() => {
        const questionKeys = Object.keys(quiz.questions)
        let newCurrentQuestionId = null;
		if (numberOfQuestions > 1)
		{
			if (currentQuestionIndex > 1)
		        newCurrentQuestionId = questionKeys[currentQuestionIndex - 1];
			else if (currentQuestionIndex === 1)
				newCurrentQuestionId = questionKeys[0];
			else
				newCurrentQuestionId = questionKeys[1];
		}
        if (newCurrentQuestionId)
            setCurrentQuestionId(newCurrentQuestionId);
      	deleteQuestion(currentQuestionId);
    }, [quiz.questions, currentQuestionIndex, currentQuestionId, deleteQuestion, numberOfQuestions]);

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
							mb='9'
                            placeholder="Question"
                            value={quiz.questions[currentQuestionId].text}
                            onChange={(event) => setQuestionText(currentQuestionId, event.target.value)}
                        />

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
                                onChange={(event) => setNewAnswerText(event.target.value)}
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
						<Tooltip content={'Dupliquer'}>
							<IconButton onClick={handleDuplicateQuestion} mt='1' variant='ghost'>
								<Copy />
							</IconButton>
						</Tooltip>
						<Tooltip content={'Supprimer'}>
							<IconButton onClick={handleDelete} disabled={!deleteIsActive} mt='1' variant='ghost'>
								<Trash2 />
							</IconButton>
						</Tooltip>
                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}

