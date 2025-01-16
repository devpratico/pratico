'use client'
import {  useRef, useMemo, useCallback } from "react"
import { Grid, Flex, Button, Container, Section, TextArea, TextField, IconButton, Card, Separator, Tooltip } from "@radix-ui/themes"
import Title from "./Title"
import { LucideProps, X, Check, Copy, Trash2, Plus } from "lucide-react"
import Navigator from "./Navigator"
import CancelButton from "./CancelButton"
import usePollCreationStore from "@/app/(frontend)/_hooks/stores/usePollCreationStore"
import CardDialog from "../../../CardDialog"
import { useSavePollService } from "@/app/(frontend)/_hooks/services/usePollCreationService"


/**
 * Represents a choice addes by the user for the current question.
 * The text is editable, and the choice can be deleted.
 */
function ChoiceRow(props: {
    text: string
    onTextChange: (newText: string) => void
    onDelete: () => void
}) {
    const { text, onTextChange, onDelete } = props
    const iconProps: LucideProps = { size: 18, strokeWidth: 2, absoluteStrokeWidth: true }
    const inputStyle = useMemo(() => ({ flexGrow:1, backgroundColor:'var(--color-background)' }), [])

    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onTextChange(event.target.value)
    }, [onTextChange])

    return (
        <Flex align='center' gap='3' width='100%'>

            <TextField.Root
                style={inputStyle}
                value={text}
                onChange={onChange}
                placeholder="Ajouter une réponse"
            />

            <Flex align='center' justify='between' gap='3'>
                <IconButton size='2' variant="ghost" color='gray' radius='full' onClick={onDelete}>
                    <X {...iconProps} />
                </IconButton>
            </Flex>

        </Flex>
    )
}


/**
 * The input to add a new choice to the current question.
 * There's a button to confirm when the user has finished typing.
 */
function NewChoice(props: {
    onConfirm: (value: string) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)

    const confirmAndClear = (value: string) => {
        if (value.trim() === '') return
        props.onConfirm(value)
        if (inputRef.current) inputRef.current.value = ''
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') confirmAndClear(event.currentTarget.value)
    }

    const onClick = () => {
        if (inputRef.current) {
            confirmAndClear(inputRef.current.value)
            inputRef.current.focus()
        }
    }

    return (
        <Flex align='center' gap='3' width='100%'>
            <TextField.Root
                ref={inputRef}
                size='3'
                placeholder="Ajouter une réponse"
                style={{ flexGrow: 1 }}
                onKeyDown={onKeyDown}
            />

            <Flex align='center' justify='between' gap='3'>
                <IconButton size='2' radius='full' onClick={onClick}>
                    <Check size={18} strokeWidth={2} absoluteStrokeWidth />
                </IconButton>
            </Flex>

        </Flex>

    )
}

/**
 * The dialog containing everything needed to create a poll.
 */
export default function PollCreation() {
    const showPollCreation = usePollCreationStore(state => state.showPollCreation)
    const deletePoll = usePollCreationStore(state => state.deletePoll)
    const poll = usePollCreationStore(state => state.currentPoll?.poll)
    const onEditTitle = usePollCreationStore(state => state.editTitle)
    const currentQuestionId = usePollCreationStore(state => state.currentPoll?.currentQuestionId)
    const changeQuestionText = usePollCreationStore(state => state.changeQuestionText)
    const addChoice = usePollCreationStore(state => state.addChoice)
    const changeCurrentQuestionIndex = usePollCreationStore(state => state.changeCurrentQuestionIndex)
    const addEmptyQuestion = usePollCreationStore(state => state.addEmptyQuestion)
    const duplicateQuestion = usePollCreationStore(state => state.duplicateQuestion)
    const deleteQuestion = usePollCreationStore(state => state.deleteQuestion)
    const deleteChoice = usePollCreationStore(state => state.deleteChoice)
    const changeChoiceText = usePollCreationStore(state => state.changeChoiceText)
    const { closePollAndSave } = useSavePollService()

    const choices = poll?.questions.find(q => q.id === currentQuestionId)?.choices
    const currentQuestionIndex = poll?.questions.findIndex(q => q.id === currentQuestionId) || 0

    if (!poll || !currentQuestionId) return null

    return (
        <CardDialog open={showPollCreation} preventClose>
            <Grid rows='auto 1fr auto' height='100%'>

                <Flex justify='between' gap='3' align='center' p='4'>
                    <Title type='poll' title={
                        
                        poll.title} onEdit={onEditTitle} />
                    <Flex gap='3' align='center'>
                        <CancelButton onCancel={deletePoll} />
                        <Button variant='soft' color='gray' onClick={closePollAndSave}>Terminer</Button>
                    </Flex>
                </Flex>


                <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                    <Section size='1'>

                        <Flex direction='column' gap='3' mt='7' align='stretch'>

                            <TextArea
                                size='3'
                                mb='9'
                                placeholder="Question"
                                value={poll.questions.find(q => q.id === currentQuestionId)?.text || ''}
                                onChange={(event) => changeQuestionText(currentQuestionId, event.target.value)}
                            />

                            <Flex direction='column' gap='3'>
                                {choices && choices.map((choice, index) => (
                                    <ChoiceRow
                                        key={choice.id}
                                        text={choice.text}
                                        onTextChange={(newText) => changeChoiceText(choice.id, newText)}
                                        onDelete={() => deleteChoice(choice.id)}
                                    />
                                ))}
                            </Flex>

                            <NewChoice onConfirm={(newChoiceText) => addChoice(currentQuestionId, { text: newChoiceText })}/>

                        </Flex>

                    </Section>
                </Container>

                <Flex p='3' justify='center'>
                    <Card variant='classic'>  
                        <Flex justify='center' gap='3'>
                            <Navigator
                                total={poll.questions.length}
                                currentQuestionIndex={currentQuestionIndex}
                                setCurrentQuestionIndex={changeCurrentQuestionIndex}
                            />
                            <Button onClick={addEmptyQuestion}><Plus/>Nouvelle question</Button>
                            <Tooltip content={'Dupliquer la question'}>
                                <IconButton mt='1' variant='ghost' onClick={() => duplicateQuestion(currentQuestionId)}>
                                    <Copy />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content={'Supprimer la question'}>
                                <IconButton mt='1' mr='1' variant='ghost' onClick={() => deleteQuestion(currentQuestionId)}>
                                    <Trash2 />
                                </IconButton>
                            </Tooltip>
                        </Flex>
                    </Card>
                </Flex>

            </Grid>
        </CardDialog>
    )
}