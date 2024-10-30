import { Poll } from "@/app/_types/poll2"
import { emptyPoll } from "@/app/_types/poll2"
import { useState } from "react"
import { Grid, Flex, Button, Tooltip, Container, Section, TextArea, TextField, IconButton } from "@radix-ui/themes"
import Title from "./Title"
import { Cloud, CloudUpload, CloudOff, Plus } from "lucide-react"


type DispatchAction =
    | { action: 'setTitle', title: string }
    | { action: 'terminate' }
    | { action: 'setQuestionText', questionId: string, text: string }
    | { action: 'addEmptyChoice', questionId: string }
    | { action: 'goNextQuestion' }
    | { action: 'goPreviousQuestion' }


interface PollCreationViewProps {
    poll: Poll
    saving: boolean
    savingError: boolean
    dispatch?: (action: DispatchAction) => void
}




/** A cloud icon indicating the status of the saving process */
function SaveStatus({ saving, savingError }: { saving: boolean, savingError: boolean }) {
    if (saving) return <Tooltip content='Sauvegarde en cours...'><CloudUpload color='var(--gray-9)' /></Tooltip>
    if (savingError) return <Tooltip content='Erreur lors de la sauvegarde'><CloudOff color='var(--red-9)' /></Tooltip>
    return <Tooltip content='Sauvegardé'><Cloud color='var(--gray-9)' /></Tooltip>
}



function PollCreationView({ poll, saving, savingError, dispatch=()=>{} }: PollCreationViewProps) {
    
    return (
        <Grid rows='auto 1fr auto' height='100%'>

            {/* Top bar */}
            <Flex justify='between' gap='3' align='center' p='4'>

                <Title type='poll' title={poll.title} onEdit={(newTitle) => dispatch({ action: 'setTitle', title: newTitle })} />
                
                <Flex gap='3' align='center'>
                    <SaveStatus saving={saving} savingError={savingError} />
                    <Button variant='soft' color='gray' onClick={() => dispatch({ action: 'terminate' })} disabled={saving}>Terminer</Button>
                </Flex>

            </Flex>

            {/* Question and answers */}
            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>

                <Section size='1'>

                    <Flex direction='column' gap='3' mt='7' align='stretch'>

                        {/* QUESTION TEXT AREA */}
                        <TextArea
                            mb='9'
                            placeholder="Question"
                            //value={poll.questions[currentQuestionId].text}
                            //onChange={(event) => setQuestionText(currentQuestionId, event.target.value)}
                        />

                        {/* ANSWERS */}
                        {/*poll.questions[currentQuestionId].choicesIds.map((choiceId, index) => (
                            <PollCreationChoiceRow key={index} questionId={currentQuestionId} choiceId={choiceId} />
                        ))*/}

                        {/* ADD NEW ANSWER AREA*/}
                        <Flex align='center' gap='2' width='100%' mt='7'>
                            <TextField.Root
                                size='3'
                                //value={newAnswerText}
                                placeholder="Ajouter une réponse"
                                style={{ width: '100%' }}
                                //onChange={(event) => setNewAnswerText(event.target.value)}
                            />
                            <IconButton
                                size='3'
                                /*onClick={() => {
                                    const newChoice: PollChoice = { text: newAnswerText }
                                    addChoice(currentQuestionId, newChoice)
                                    setNewAnswerText('');
                                }}*/
                            ><Plus /></IconButton>
                        </Flex>



                    </Flex>

                </Section>
            </Container>

        </Grid>
    )
}






interface PollCreation2Props {
    initialPoll?: Poll
    idToSaveTo?: number
}


export default function PollCreation2({ initialPoll, idToSaveTo }: PollCreation2Props) {
    const [poll, setPoll] = useState(initialPoll || emptyPoll)


    return (
        <PollCreationView poll={poll} saving={false} savingError={false} />
    )
}