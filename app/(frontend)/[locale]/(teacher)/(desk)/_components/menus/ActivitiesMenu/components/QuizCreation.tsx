'use client'
import { Grid, Button, Flex, IconButton, TextField, Container, Section, TextArea, Card, Tooltip } from '@radix-ui/themes'
import { useCallback, useState, useMemo } from 'react'
import { useQuiz } from '@/app/(frontend)/_hooks/contexts/useQuiz'
import { saveActivity } from '@/app/(backend)/api/activity/activitiy.client'
import Title from './Title'
import CancelButton from './CancelButton'
//import { QuizCreationChoiceRow } from './CreationChoiceRow'
import Navigator from './Navigator'
import { Copy, Plus, Trash2 } from 'lucide-react'
import { QuizChoice } from '@/app/_types/quiz'
import logger from '@/app/_utils/logger'
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation'




export default function QuizCreation({ idToSaveTo, closeDialog }: {  idToSaveTo?: number, closeDialog: () => void }) {
    const router = useRouter()

    return (
        <Grid rows='auto 1fr auto' height='100%'>

            <Flex justify='between' gap='3' align='center' p='4'>

                <Title type='quiz' title={'Titre'} onEdit={(newTitle) => {}} />


                <Flex gap='3' align='baseline'>
                    <CancelButton onCancel={closeDialog} />
                    <Button variant='soft' onClick={() => {}} disabled={false}>Terminer</Button>
                </Flex>
            </Flex>


            <Container size='2' px='3' maxHeight='100%' overflow='scroll'>
                <Section size='1'>


                    <Flex direction='column' gap='3' mt='7' align='stretch'>

                        {/* QUESTION TEXT AREA */}
                        <TextArea
							mb='9'
                            placeholder="Question"
                            value={"Question"}
                            onChange={(event) => {}}
                        />

                        {/* ANSWERS 
                        {quiz.questions[currentQuestionId].choicesIds.map((choiceId, index) => (
                            <QuizCreationChoiceRow key={index} questionId={currentQuestionId} choiceId={choiceId} />
                        ))}
                            */}

                        {/* ADD NEW ANSWER AREA*/}
                        <Flex align='center' gap='2' width='100%' mt='7'>
                            <TextField.Root
                                size='3'
                                value={'bonjour'}
                                placeholder="Ajouter une réponse"
                                style={{ width: '100%' }}
                                onChange={(event) => {}}
                            />
                            <IconButton
                                size='3'
                                onClick={() => {}}
                            ><Plus /></IconButton>
                        </Flex>
                    </Flex>

                </Section>
            </Container>


            <Flex p='3' pt='0' justify='center'>
                <Card variant='classic'>
                    <Flex justify='center' gap='3'>
                        <Navigator total={10} currentQuestionIndex={0} setCurrentQuestionIndex={(index) => {}} />
                        <Button onClick={() => {}}>Nouvelle question</Button>
						<Tooltip content={'Dupliquer'}>
							<IconButton onClick={() => {}} mt='1' variant='ghost'>
								<Copy />
							</IconButton>
						</Tooltip>
						<Tooltip content={'Supprimer'}>
							<IconButton onClick={() => {}} disabled={false} mt='1' variant='ghost'>
								<Trash2 />
							</IconButton>
						</Tooltip>
                    </Flex>
                </Card>
            </Flex>

        </Grid>
    )
}

