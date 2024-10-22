'use client'
import { Grid, Button, Flex, IconButton, TextField, Container, Section, TextArea, Box, Card, Tooltip } from '@radix-ui/themes'
import { useCallback, useMemo, useState } from 'react'
import { usePoll } from '@/app/(frontend)/_hooks/usePoll'
import { PollChoice } from '@/app/_types/poll'
import saveActivity from '@/app/(backend)/api/activity/save/wrapper'
import Title from './Title'
import CancelButton from './CancelButton'
import { PollCreationChoiceRow } from './CreationChoiceRow'
import Navigator from './Navigator'
import { Copy, Plus, Trash2 } from 'lucide-react'




export default function PollCreation({ idToSaveTo, closeDialog }: { idToSaveTo?: number, closeDialog: () => void }) {
    const {
        poll,
        setTitle,
        addEmptyQuestion,
        setQuestionText,
        addChoice,
        setChoiceText,
        deleteQuestion,
		duplicateQuestion
    } = usePoll()
    const [currentQuestionId, setCurrentQuestionId] = useState(Object.keys(poll.questions)[0])
    const currentQuestionIndex = useMemo(() => Object.keys(poll.questions).indexOf(currentQuestionId), [poll, currentQuestionId])
    const setCurrentQuestionIndex = useCallback((index: number) => setCurrentQuestionId(Object.keys(poll.questions)[index]), [poll])
    const [isSaving, setIsSaving] = useState(false)
	const [ deleteActive, setDeleteActive ] = useState(false);
    const [newAnswerText, setNewAnswerText] = useState('')

    const handleAddNewQuestion = useCallback(() => {
        const { questionId } = addEmptyQuestion()
        //const lastQuestionId = Object.keys(poll.questions).pop()
        //if (lastQuestionId) setCurrentQuestionId(lastQuestionId)
        setCurrentQuestionId(questionId);
		setDeleteActive(true);
    }, [addEmptyQuestion, setCurrentQuestionId])

	const handleDuplicateQuestion = useCallback(() => {
		const { questionId } = duplicateQuestion(currentQuestionId);

		setCurrentQuestionId(questionId);
		setDeleteActive(true);
	}, [duplicateQuestion, setCurrentQuestionId, currentQuestionId])

    const handleSave = useCallback(async () => {
        setIsSaving(true)
        await saveActivity({ id: idToSaveTo, activity: poll })
        closeDialog()
        setIsSaving(false)
    }, [poll, closeDialog, idToSaveTo])

	const handleDelete = useCallback(() => {
        const questionKeys = Object.keys(poll.questions)
        const index = questionKeys.indexOf(currentQuestionId)
        const newCurrentQuestionId = questionKeys.length > 0
            ? (index > 0 ? questionKeys[index - 1] : questionKeys[0])
            : null 
        if (newCurrentQuestionId)
            setCurrentQuestionId(newCurrentQuestionId);
      	const isLastQuestionEmpty = deleteQuestion(currentQuestionId);
		setDeleteActive(!isLastQuestionEmpty);
    }, [poll.questions, currentQuestionId, deleteQuestion]);

    return (
        <Grid rows='auto 1fr auto' height='100%'>

            <Flex justify='between' gap='3' align='center' p='4'>

                <Title type='poll' title={poll.title} onEdit={(newTitle) => setTitle(newTitle)} />

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
                            value={poll.questions[currentQuestionId].text}
                            onChange={(event) => {
								setQuestionText(currentQuestionId, event.target.value);
								setDeleteActive(true);
							}}
                        />

                        {/* ANSWERS */}
                        {poll.questions[currentQuestionId].choicesIds.map((choiceId, index) => (
                            <PollCreationChoiceRow key={index} questionId={currentQuestionId} choiceId={choiceId} />
                        ))}

                        {/* ADD NEW ANSWER AREA*/}
                        <Flex align='center' gap='2' width='100%' mt='7'>
                            <TextField.Root
                                size='3'
                                value={newAnswerText}
                                placeholder="Ajouter une réponse"
                                style={{ width: '100%' }}
                                onChange={(event) => {
									setNewAnswerText(event.target.value)
									setDeleteActive(true);
								}}
                            />
                            <IconButton
                                size='3'
                                onClick={() => {
                                    const newChoice: PollChoice = { text: newAnswerText }
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
                        <Navigator total={Object.keys(poll.questions).length} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} />
                        <Button onClick={handleAddNewQuestion}>Nouvelle question</Button>
						<Tooltip content={'Dupliquer'}>
							<IconButton onClick={handleDuplicateQuestion} mt='1' variant='ghost'>
								<Copy />
							</IconButton>
						</Tooltip>
						<Tooltip content={'Supprimer (bientôt disponible)'}>
							<IconButton onClick={handleDelete} disabled={!deleteActive} mt='1' variant='ghost'>
								<Trash2 />
							</IconButton>
						</Tooltip>
                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}
