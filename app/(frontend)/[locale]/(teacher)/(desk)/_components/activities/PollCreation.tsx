'use client'
import { Grid, Button, Flex, IconButton, TextField, Container, Section, TextArea, Box, Card } from '@radix-ui/themes'
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

    const [newAnswerText, setNewAnswerText] = useState('')

    const handleAddNewQuestion = useCallback(() => {
        const { questionId } = addEmptyQuestion()
        //const lastQuestionId = Object.keys(poll.questions).pop()
        //if (lastQuestionId) setCurrentQuestionId(lastQuestionId)
        setCurrentQuestionId(questionId)
    }, [addEmptyQuestion, setCurrentQuestionId])

	const handleDuplicateQuestion = useCallback(() => {
		const { questionId } = duplicateQuestion(currentQuestionId);

		setCurrentQuestionId(questionId);
	}, [duplicateQuestion, setCurrentQuestionId, currentQuestionId])

    const handleSave = useCallback(async () => {
        setIsSaving(true)
        await saveActivity({ id: idToSaveTo, activity: poll })
        closeDialog()
        setIsSaving(false)
    }, [poll, closeDialog, idToSaveTo])


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
                            onChange={(event) => { setQuestionText(currentQuestionId, event.target.value )}}
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
                                onChange={(event) => { setNewAnswerText(event.target.value) }}
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
						<Copy onClick={handleDuplicateQuestion} style={{marginTop: '3px', cursor: 'pointer', color: 'var(--violet-9)'}} />
						<Button onClick={() => deleteQuestion(currentQuestionId)} disabled><Trash2 style={{/*marginTop: '3px', cursor: 'pointer', color: 'var(--violet-9)'*/}}/></Button>
                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}
