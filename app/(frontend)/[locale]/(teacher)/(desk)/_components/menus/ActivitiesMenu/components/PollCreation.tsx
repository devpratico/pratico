'use client'
import {  useRef, useMemo, useCallback } from "react"
import { Grid, Flex, Button, Container, Section, TextArea, TextField, IconButton, Box, Card, Separator, Tooltip } from "@radix-ui/themes"
import Title from "./Title"
import {  LucideProps, GripVertical, X, Check, Copy, Trash2, Plus, Car } from "lucide-react"
import { changeTitle } from "@/app/_types/activity"
//import DnD from "./DnDFlex"
import Navigator from "./Navigator"
import { saveActivity } from "@/app/(backend)/api/activity/activitiy.client"
import CancelButton from "./CancelButton"
//import { useActivityCreationStore } from "../../../../store"
import useActivityCreationStore from "../../../../../../../_stores/useActivityCreationStore"
import CardDialog from "../../../CardDialog"


interface ChoiceRowProps {
    text: string
    style?: 'normal' | 'active' | 'overlay'
    onTextChange: (newText: string) => void
    onDelete: () => void
}

function ChoiceRow({text, style='normal', onTextChange, onDelete}: ChoiceRowProps) {
    //const text = useMemo(() => state.text, [state.text])
    //const [value, setValue] = useState(text)
    const iconProps: LucideProps = { size: 18, strokeWidth: 2, absoluteStrokeWidth: true }
    const opacity = style === 'active' ? 0 : 1
    const shadow = style === 'overlay' ? 'var(--shadow-2), var(--shadow-4)' : undefined
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
        onTextChange(event.target.value)
    }, [onTextChange])

    return (
        <Flex align='center' gap='3' width='100%' style={flexStyle}>

            <TextField.Root
                style={inputStyle}
                value={text}
                //value={value}
                onChange={onChange}
                //onBlur={onBlur}
                placeholder="Ajouter une réponse"
            />

            <Flex align='center' justify='between' gap='3'>

                <IconButton size='2' variant="ghost" color='gray' radius='full' onClick={onDelete}>
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
    onConfirm: (newChoiceText: string) => void
}

function NewChoice({ onConfirm }: NewChoiceProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const confirmAndClear = (value: string) => {
        if (value.trim() === '') return
        onConfirm(value)
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


export default function PollCreation() {
    const showActivityCreation = useActivityCreationStore(state => state.showActivityCreation)
    const poll = useActivityCreationStore(state => state.currentActivity?.activity)
    const onEditTitle = useActivityCreationStore(state => state.editTitle)
    const currentQuestionId = useActivityCreationStore(state => state.currentActivity?.currentQuestionId)
    const changeQuestionText = useActivityCreationStore(state => state.changeQuestionText)
    const addChoice = useActivityCreationStore(state => state.addChoice)
    const changeCurrentQuestionIndex = useActivityCreationStore(state => state.changeCurrentQuestionIndex)
    const addEmptyQuestion = useActivityCreationStore(state => state.addEmptyQuestion)
    const duplicateQuestion = useActivityCreationStore(state => state.duplicateQuestion)
    const deleteQuestion = useActivityCreationStore(state => state.deleteQuestion)
    const deleteChoice = useActivityCreationStore(state => state.deleteChoice)
    const changeChoiceText = useActivityCreationStore(state => state.changeChoiceText)

    const choices = poll?.questions.find(q => q.id === currentQuestionId)?.choices
    const currentQuestionIndex = poll?.questions.findIndex(q => q.id === currentQuestionId) || 0

    if (!poll || !currentQuestionId) return null

    return (
        <CardDialog open={showActivityCreation} preventClose>
            <Grid rows='auto 1fr auto' height='100%'>

                <Flex justify='between' gap='3' align='center' p='4'>
                    <Title type='poll' title={
                        
                        poll.title} onEdit={onEditTitle} />
                    <Flex gap='3' align='center'>
                        <CancelButton onCancel={()=>{}} />
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
                                value={poll.questions.find(q => q.id === currentQuestionId)?.text || ''}
                                onChange={(event) => changeQuestionText(currentQuestionId, event.target.value)}
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
                                {choices && choices.map((choice, index) => (
                                    <ChoiceRow
                                        key={choice.id}
                                        text={choice.text}
                                        style='normal'
                                        onTextChange={(newText) => changeChoiceText(choice.id, newText)}
                                        onDelete={() => deleteChoice(choice.id)}
                                    />
                                ))}
                            </Flex>

                            <Separator size='4' />

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



async function closeAndSave() {
    const { currentActivity, closeActivity, setIsSaving } = useActivityCreationStore.getState()

    if (!currentActivity) return
    const poll = currentActivity.activity

    setIsSaving(true)
    closeActivity()

    await saveActivity({ activity: poll })

    setIsSaving(false)
}