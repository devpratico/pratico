'use client'
import { Poll } from "@/app/_types/poll2"
import { emptyPoll, mockPoll, changeQuestionText, changeChoiceText, deleteChoice, addChoice, addEmptyQuestion, duplicateQuestion, deleteQuestion } from "@/app/_types/poll2"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Grid, Flex, Button, Container, Section, TextArea, TextField, IconButton, Box, Card, Separator, Tooltip } from "@radix-ui/themes"
import Title from "./Title"
import {  LucideProps, GripVertical, X, Check, Copy, Trash2, Plus } from "lucide-react"
import { changeTitle } from "@/app/_types/activity"
//import DnD from "./DnDFlex"
import Navigator from "./Navigator"
import { saveActivity } from "@/app/(backend)/api/activity/activitiy.client"
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation"
import CancelButton from "./CancelButton"
import { useActivityCreationStore } from "../../../../capsule/[capsule_id]/store"


interface ChoiceRowProps {
    state: {
        text: string
        style?: 'normal' | 'active' | 'overlay'
    },
    actions: {
        onTextChange: (newText: string) => void
        onDelete: () => void
    }
}

function ChoiceRow({state, actions}: ChoiceRowProps) {
    //const text = useMemo(() => state.text, [state.text])
    //const [value, setValue] = useState(text)
    const iconProps: LucideProps = { size: 18, strokeWidth: 2, absoluteStrokeWidth: true }
    const opacity = state.style === 'active' ? 0 : 1
    const shadow = state.style === 'overlay' ? 'var(--shadow-2), var(--shadow-4)' : undefined
    const flexStyle = { opacity }
    //const inputStyle = { flexGrow:1, boxShadow: shadow, backgroundColor:'var(--color-background)' }
    const inputStyle = useMemo(() => ({ flexGrow:1, boxShadow: shadow, backgroundColor:'var(--color-background)' }), [shadow])

    /*const onBlur = useCallback(()=>(event: React.ChangeEvent<HTMLInputElement>) => {
        //actions.onTextChange(event.target.value)
        requestAnimationFrame(() => {actions.onTextChange(event.target.value)})
    }, [actions])*/

    /*const onChange = useCallback(()=>(event: React.ChangeEvent<HTMLInputElement>) => {
        //actions.onTextChange(event.target.value)
        setValue(event.target.value)
    }, [setValue])*/

    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        actions.onTextChange(event.target.value)
    }, [actions])

    const handleClickDelete = () => {
        actions.onDelete()
    }

    return (
        <Flex align='center' gap='3' width='100%' style={flexStyle}>

            <TextField.Root
                style={inputStyle}
                value={state.text}
                //value={value}
                onChange={onChange}
                //onBlur={onBlur}
                placeholder="Ajouter une réponse"
            />

            <Flex align='center' justify='between' gap='3'>

                <IconButton size='2' variant="ghost" color='gray' radius='full' onClick={handleClickDelete}>
                    <X {...iconProps} />
                </IconButton>

                {/*<DnD.GrabHandle>
                    <IconButton size='2' variant="ghost" color='gray' style={{cursor: state.style === 'normal' ? 'grab' : 'grabbing'}}>
                        <GripVertical {...iconProps} opacity={0.5}/>
                    </IconButton>
                </DnD.GrabHandle>*/}

            </Flex>

        </Flex>
    )
}



interface NewChoiceProps {
    actions: {
        onConfirm: (newChoiceText: string) => void
    }
}

function NewChoice({ actions }: NewChoiceProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const confirmAndClear = (value: string) => {
        if (value.trim() === '') return
        actions.onConfirm(value)
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


interface PollCreationViewProps {
    state: {
        poll: Poll
        currentQuestionIndex: number
    },
    actions: {
        onEditTitle: (newTitle: string) => void
        onTerminate: () => void
        onEditQuestionText: (questionId: string, newText: string) => void
        onEditChoiceText: (choiceId: string, newText: string) => void
        onAddChoice: (questionId: string, choice: { text: string }) => void
        onDeleteChoice: (choiceId: string) => void
        onSetCurrentQuestionIndex: (index: number) => void
        onAddEmptyQuestion: () => void
        onDuplicateQuestion: (questionId: string) => void
        onDeleteQuestion: (questionId: string) => void
    }
}

function PollCreationView({ state, actions }: PollCreationViewProps) {
    const currentQuestion = state.poll.questions[state.currentQuestionIndex]
    const choicesIds = currentQuestion.choices.map(choice => choice.id)

    return (
        <Grid rows='auto 1fr auto' height='100%'>

            <Flex justify='between' gap='3' align='center' p='4'>
                <Title type='poll' title={state.poll.title} onEdit={(newTitle) => actions.onEditTitle(newTitle)} />
                <Flex gap='3' align='center'>
                    <CancelButton onCancel={()=>{}} />
                    <Button variant='soft' color='gray' onClick={() => actions.onTerminate()}>Terminer</Button>
                </Flex>
            </Flex>


            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>

                    <Flex direction='column' gap='3' mt='7' align='stretch'>

                        <TextArea
                            size='3'
                            mb='9'
                            placeholder="Question"
                            value={currentQuestion.text}
                            onChange={(event) => actions.onEditQuestionText(currentQuestion.id, event.target.value)}
                        />


                        {/*<DnD.Flex direction='column' gap='3'>/ key={choicesIds.join('')}>/
                            {choicesIds.map((choiceId, index) => (
                                <DnD.Item id={choiceId} key={choiceId}>

                                    <DnD.Normal>
                                        <ChoiceRow
                                            //key={'n-'+index}
                                            key={choiceId}
                                            state={{ 
                                                text: currentQuestion.choices.find(c => c.id === choiceId)?.text || '',
                                                style: 'normal'
                                            }}
                                            actions={{
                                                onTextChange: (newText) => {actions.onEditChoiceText(choiceId, newText)},
                                                onDelete: () => { actions.onDeleteChoice(choiceId) }
                                            }}
                                        />
                                    </DnD.Normal>

                                    <DnD.Overlay>
                                        <ChoiceRow
                                            //key={'o-'+index}
                                            state={{ 
                                                text: currentQuestion.choices.find(c => c.id === choiceId)?.text || '',
                                                style: 'overlay'
                                            }}
                                            actions={{
                                                onTextChange: (newText) => {},
                                                onDelete: () => {}
                                            }}
                                        />
                                    </DnD.Overlay>
                                </DnD.Item>
                            ))}
                        </DnD.Flex>*/}

                        <Flex direction='column' gap='3'>
                            {choicesIds.map((choiceId, index) => (
                                <ChoiceRow
                                    key={choiceId}
                                    state={{ 
                                        text: currentQuestion.choices.find(c => c.id === choiceId)?.text || '',
                                        style: 'normal'
                                    }}
                                    actions={{
                                        onTextChange: (newText) => { actions.onEditChoiceText(choiceId, newText) },
                                        onDelete: () => { actions.onDeleteChoice(choiceId) }
                                    }}
                                />
                            ))}
                        </Flex>

                        <Separator size='4' />

                        <NewChoice actions={{
                            onConfirm: (newChoiceText) => {actions.onAddChoice(currentQuestion.id, { text: newChoiceText })}
                        }} />

                    </Flex>

                </Section>
            </Container>

            <Flex p='3' justify='center'>
                <Card variant='classic'>
                    <Flex justify='center' gap='3'>
                        <Navigator
                            total={state.poll.questions.length}
                            currentQuestionIndex={state.currentQuestionIndex}
                            setCurrentQuestionIndex={(index) => {actions.onSetCurrentQuestionIndex(index)}}
                        />
                        <Button onClick={actions.onAddEmptyQuestion}><Plus/>Nouvelle question</Button>
                        <Tooltip content={'Dupliquer la question'}>
                            <IconButton onClick={() => actions.onDuplicateQuestion(currentQuestion.id)}mt='1' variant='ghost'>
                                <Copy />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content={'Supprimer la question'}>
                            <IconButton  onClick={() => actions.onDeleteQuestion(currentQuestion.id)} mt='1' mr='1' variant='ghost'>
                                <Trash2 />
                            </IconButton>
                        </Tooltip>
                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}






interface PollCreationProps {
    initialPoll?: Poll
    idToSaveTo?: number
    onClickTerminate?: () => void
    onSaveOver?: (error: string | null) => void
}


export default function PollCreation({ initialPoll, idToSaveTo, onClickTerminate, onSaveOver }: PollCreationProps) {
    const router = useRouter()
    const [poll, setPoll] = useState(initialPoll || mockPoll)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const state: PollCreationViewProps['state'] = {
        poll,
        currentQuestionIndex
    }

    const actions: PollCreationViewProps['actions'] = {
        onEditTitle: (newTitle) => {
            setPoll(changeTitle(newTitle))
        },

        onTerminate: async () => {
            onClickTerminate?.()
            const {error} = await saveActivity({ id: idToSaveTo, activity: poll })
            router.refresh()
            onSaveOver?.(error)
        },

        onEditQuestionText: (questionId, newText) => {
            setPoll(changeQuestionText({ questionId, newText }))
        },

        onEditChoiceText: (choiceId, newText) => {
            setPoll(changeChoiceText({ choiceId, newText }))
        },

        onAddChoice: (questionId, choice) => {
            setPoll(addChoice({ questionId, choice }))
        },

        onDeleteChoice: (choiceId) => {
            setPoll(deleteChoice(choiceId))
        },

        onSetCurrentQuestionIndex: (index) => {
            setCurrentQuestionIndex(index)
        },

        onAddEmptyQuestion: () => {
            setPoll(addEmptyQuestion())
            setCurrentQuestionIndex(poll.questions.length)
        },

        onDuplicateQuestion: (questionId) => {
            setPoll(duplicateQuestion(questionId))
            // Find the index of the duplicated question (just after the original one)
            const index = poll.questions.findIndex(q => q.id === questionId) + 1
            setCurrentQuestionIndex(index)
        },

        onDeleteQuestion: (questionId) => {
            setPoll(deleteQuestion(questionId))
            setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
        }
    }


    return (
        <PollCreationView state={state} actions={actions} />
    )
}