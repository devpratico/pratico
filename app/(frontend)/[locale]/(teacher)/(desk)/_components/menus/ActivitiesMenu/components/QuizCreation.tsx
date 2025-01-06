'use client'
import { Grid, Button, Flex, IconButton, TextField, Container, Section, TextArea, Card, Tooltip, Switch, Badge } from '@radix-ui/themes'
import Title from './Title'
import CancelButton from './CancelButton'
import Navigator from './Navigator'
import { Copy, Plus, X, Trash2, Check } from 'lucide-react'
import CardDialog from '../../../CardDialog'
import useQuizCreationStore from '@/app/(frontend)/_hooks/stores/useQuizCreationStore'
import { useSaveQuizService } from '@/app/(frontend)/_hooks/services/useQuizCreationService'
import { useRef } from 'react'


function TrueFalseSwitch(props: {
    value: boolean
    onChange: (newValue: boolean) => void
}) {
    const { value, onChange } = props
    const badgeTxt = value ? 'Vrai' : 'Faux'
    const badgeCol = value ? 'green' : 'gray'

    return (
        <Flex align='center' gap='1' width='80px'>
            <Switch checked={value} onCheckedChange={onChange} color='green'/>
            <Badge radius='full' color={badgeCol}>{badgeTxt}</Badge>
        </Flex>
    )
}


function ChoiceRow(props: {
    text: string
    isCorrect: boolean
    onTextChange: (newText: string) => void
    onCorrectChange: (isCorrect: boolean) => void
    onDelete: () => void
}) {
    const { text, isCorrect, onTextChange, onCorrectChange, onDelete } = props

    return (
        <Flex align='center' gap='3' width='100%'>
            <TextField.Root
                style={{ flexGrow: 1 }}
                value={text}
                onChange={(event) => onTextChange(event.target.value)}
                placeholder="Ajouter une réponse"
            />
            <TrueFalseSwitch value={isCorrect} onChange={onCorrectChange} />
            <IconButton size='2' variant="ghost" color='gray' radius='full' onClick={onDelete}>
                <X size={18} strokeWidth={2} absoluteStrokeWidth />
            </IconButton>
        </Flex>
    )
}


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
            <IconButton size='2' radius='full' onClick={onClick}>
                <Check size={18} strokeWidth={2} absoluteStrokeWidth />
            </IconButton>
        </Flex>
    )
}

export default function QuizCreation() {
    const showQuizCreation = useQuizCreationStore(state => state.showQuizCreation)
    const removeQuiz = useQuizCreationStore(state => state.removeQuiz)
    const quiz = useQuizCreationStore(state => state.quiz)
    const setTitle = useQuizCreationStore(state => state.setTitle)
    const currentQuestionId = useQuizCreationStore(state => state.currentQuestionId)
    const setQuestionText = useQuizCreationStore(state => state.setQuestionText)
    const addChoice = useQuizCreationStore(state => state.addChoice)
    const setChoiceText = useQuizCreationStore(state => state.setChoiceText)
    const setChoiceCorrect = useQuizCreationStore(state => state.setChoiceCorrect)
    const removeChoice = useQuizCreationStore(state => state.removeChoice)
    const setCurrentQuestion = useQuizCreationStore(state => state.setCurrentQuestion)
    const addEmptyQuestion = useQuizCreationStore(state => state.addEmptyQuestion)
    const duplicateQuestion = useQuizCreationStore(state => state.duplicateQuestion)
    const removeQuestion = useQuizCreationStore(state => state.removeQuestion)
    const { closeAndSave } = useSaveQuizService()

    const choices = quiz?.questions.find(q => q.id === currentQuestionId)?.choices
    const currentQuestionIndex = quiz?.questions.findIndex(q => q.id === currentQuestionId) || 0

    if (!quiz || !currentQuestionId) return null

    return (
        <CardDialog open={showQuizCreation} preventClose>
            <Grid rows='auto 1fr auto' height='100%'>

                <Flex justify='between' gap='3' align='center' p='4'>
                    <Title type='quiz' title={quiz.title} onEdit={setTitle} />
                    <Flex gap='3' align='center'>
                        <CancelButton onCancel={removeQuiz} />
                        <Button variant='soft' color='gray' onClick={closeAndSave}>Terminer</Button>
                    </Flex>
                </Flex>

                <Container size='2' px='3' maxHeight='100%' overflow='scroll'>
                    <Section size='1'>
                        <Flex direction='column' gap='3' mt='7' align='stretch'>
                            <TextArea
                                size='3'
                                mb='9'
                                placeholder="Question"
                                value={quiz.questions.find(q => q.id === currentQuestionId)?.text || ''}
                                onChange={(event) => setQuestionText({ id: currentQuestionId, text: event.target.value })}
                            />

                            <Flex direction='column' gap='3'>
                                {choices && choices.map((choice, index) => (
                                    <ChoiceRow
                                        key={choice.id}
                                        text={choice.text}
                                        isCorrect={choice.isCorrect}
                                        onTextChange={(newText) => setChoiceText(choice.id, newText)}
                                        onCorrectChange={(isCorrect) => setChoiceCorrect(choice.id, isCorrect)}
                                        onDelete={() => removeChoice(choice.id)}
                                    />
                                ))}
                            </Flex>

                            <NewChoice onConfirm={(newChoiceText) => addChoice(newChoiceText)} />
                        </Flex>
                    </Section>
                </Container>

                <Flex p='3' justify='center'>
                    <Card variant='classic'>
                        <Flex justify='center' gap='3'>
                            <Navigator
                                total={quiz.questions.length}
                                currentQuestionIndex={currentQuestionIndex}
                                setCurrentQuestionIndex={(index) => setCurrentQuestion({ index })}
                            />
                            <Button onClick={addEmptyQuestion}><Plus />Nouvelle question</Button>
                            <Tooltip content={'Dupliquer la question'}>
                                <IconButton mt='1' variant='ghost' onClick={() => duplicateQuestion(currentQuestionId)}>
                                    <Copy />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content={'Supprimer la question'}>
                                <IconButton mt='1' mr='1' variant='ghost' onClick={() => removeQuestion(currentQuestionId)}>
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

