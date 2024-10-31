import { Poll } from "@/app/_types/poll2"
import { emptyPoll, mockPoll, getQuestionIndex } from "@/app/_types/poll2"
import { useState } from "react"
import { Grid, Flex, Button, Tooltip,TooltipProps, Container, Section, TextArea, TextField, IconButton, Text, Box, Card } from "@radix-ui/themes"
import Title from "./Title"
import { Cloud, CloudUpload, CloudOff, Plus, LucideProps, GripVertical, X } from "lucide-react"



interface PollCreationViewProps {
    poll: Poll
    currentQuestionIndex: number
    saving: boolean
    savingError: boolean
    onEditTitle?: (newTitle: string) => void
    onTerminate?: () => void
    onEditQuestionText?: (questionId: string, newText: string) => void
    onEditChoiceText?: (choiceId: string, newText: string) => void
    onDeleteChoice?: (choiceId: string) => void
}




/** A cloud icon indicating the status of the saving process */
function SaveStatus({ isSaving, savingError }: { isSaving: boolean, savingError: boolean }) {
    const tooltipProps: Omit<TooltipProps, 'content'> = { side: 'left' }
    const iconProps: LucideProps = { size: 18, strokeWidth: 2, absoluteStrokeWidth: true }

    if (isSaving) {
        return (
            <Tooltip content='Sauvegarde en cours...' {...tooltipProps}>
                <CloudUpload color='var(--gray-9)' {...iconProps} />
            </Tooltip>
        )
    }

    if (savingError) {
        return (
            <Tooltip content='Erreur lors de la sauvegarde' {...tooltipProps}>
                <CloudOff color='var(--red-9)' {...iconProps} />
            </Tooltip>
        )
    }

    return (
        <Tooltip content='Sauvegardé' {...tooltipProps}>
            <Cloud color='var(--gray-9)' {...iconProps} />
        </Tooltip>
    )
}



interface ChoiceRowProps {
    text: string
    /** When the user presses Enter */
    onEditEnded?: (newText: string) => void
    onDelete?: () => void
}

function ChoiceRow({ text, onEditEnded, onDelete }: ChoiceRowProps) {
    const iconProps: LucideProps = { size: 18, strokeWidth: 2, absoluteStrokeWidth: true }

    return (
        <Flex align='center' gap='3' width='100%'>

            <TextField.Root
                style={{flexGrow: 1}}
                value={text}
                placeholder="Ajouter une réponse"
                onKeyDown={(event) => { if (event.key === 'Enter') onEditEnded?.(event.currentTarget.value) }}
            />

            <IconButton size='2' variant="ghost" color='gray' onClick={onDelete}>
                <X {...iconProps} />
            </IconButton>

            <IconButton size='2' variant="ghost" color='gray' disabled>
                <GripVertical {...iconProps} />
            </IconButton>

        </Flex>
    )
}



function PollCreationView({ poll, currentQuestionIndex, saving, savingError, onEditTitle, onTerminate, onEditQuestionText, onEditChoiceText, onDeleteChoice }: PollCreationViewProps) {
    
    return (
        <Grid rows='auto 1fr auto' height='100%'>

            {/* Top bar */}
            <Flex justify='between' gap='3' align='center' p='4'>

                <Title type='poll' title={poll.title} onEdit={(newTitle) => onEditTitle?.(newTitle)} />
                
                <Flex gap='3' align='center'>
                    <SaveStatus isSaving={saving} savingError={savingError} />
                    <Button variant='soft' color='gray' onClick={() => onTerminate?.()}>Terminer</Button>
                </Flex>

            </Flex>

            {/* Question and answers */}
            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>

                    <Flex direction='column' gap='3' mt='7' align='stretch'>

                        {/* QUESTION TEXT AREA */}
                        <TextArea
                            size='3'
                            mb='9'
                            placeholder="Question"
                            value={poll.questions[currentQuestionIndex].text}
                            onChange={(event) => onEditQuestionText?.(poll.questions[currentQuestionIndex].id, event.target.value)}
                        />

                        {/* ANSWERS */}
                        {poll.questions[currentQuestionIndex].choices.map((choice, index) => (
                            <ChoiceRow
                                key={index}
                                text={choice.text}
                                onEditEnded={(newText) => onEditChoiceText?.(choice.id, newText)}
                                onDelete={() => onDeleteChoice?.(choice.id)}
                            />
                        ))}



                        {/* ADD NEW ANSWER AREA*/}
                        <Flex align='center' gap='2' width='100%' mt='7'>
                            <TextField.Root
                                size='3'
                                //value={newAnswerText}
                                placeholder="Ajouter une réponse"
                                style={{ width: '100%' }}
                                //onChange={(event) => setNewAnswerText(event.target.value)}
                            />

                        </Flex>



                    </Flex>

                </Section>
            </Container>

            <Box p='4'>
                <Card variant="classic">
                    Hello
                </Card>
            </Box>

        </Grid>
    )
}






interface PollCreation2Props {
    initialPoll?: Poll
    idToSaveTo?: number
}


export default function PollCreation({ initialPoll, idToSaveTo }: PollCreation2Props) {
    const [poll, setPoll] = useState(initialPoll || mockPoll)
    const currentQuestionIndex = 0


    return (
        <PollCreationView poll={poll} saving={false} savingError={false} currentQuestionIndex={currentQuestionIndex} />
    )
}