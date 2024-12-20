'use client'
import { Container, Section, Dialog, Flex, Heading } from "@radix-ui/themes"
import { Poll } from "@/app/_types/poll"
import { PollAnswerRow } from "@/app/(frontend)/[locale]/(teacher)/(desk)/_components/activities/PollAnimation"
import { useUser } from "@/app/(frontend)/_hooks/useUser"
import { useEffect, useMemo, useState, useCallback } from "react"
import { usePollSnapshot } from "@/app/(frontend)/_hooks/usePollSnapshot"
import logger from "@/app/_utils/logger"
import createClient from "@/supabase/clients/client"


export default function PollAnswering() {
    const { userId } = useUser()
    const { snapshot, addAnswer, removeAnswer } = usePollSnapshot()
    const [activityId, setActivityId] = useState<number | undefined>(() => snapshot?.activityId)
    const [quiz, setPoll] = useState<Poll | undefined>(undefined)

    // Change the activityId when the snapshot changes, if needed
    useEffect(() => {
        if (snapshot?.activityId !== activityId) {
            setActivityId(snapshot?.activityId)
        }
    }, [snapshot, activityId])

    // Fetch the quiz if the activityId changes
    useEffect(() => {
        if (activityId) {
            const supabase = createClient()
            supabase.from('activities').select('*').eq('id', activityId).single().then(({ data, error }) => {
                if (error || !data) {
                    logger.error('supabase:database', 'Error fetching activity', error?.message)
                } else {
                    if (data.type === 'poll') {
                        setPoll(data.object as any as Poll)
                    }
                }
            })
        }
    }, [activityId])

    const currentQuestionId = useMemo(() => snapshot?.currentQuestionId, [snapshot])

    const questionText = useMemo(() => {
        if (!quiz) return ''
        return currentQuestionId ? quiz.questions[currentQuestionId].text : ''
    }, [quiz, currentQuestionId])

    const currentQuestionChoicesIds = useMemo(() => {
        if (!quiz) return []
        return currentQuestionId ? quiz.questions[currentQuestionId].choicesIds : []
    }, [quiz, currentQuestionId])

    const currentQuestionChoices = useMemo(() => {
        if (!quiz) return []
        return currentQuestionChoicesIds.map(choiceId => quiz.choices[choiceId])
    }, [quiz, currentQuestionChoicesIds])

    const usersAnswers = useMemo(() => {
        const allAnswersAsArray = Object.values(snapshot?.answers || {})
        const currentQuestionAnswers = allAnswersAsArray.filter(answer => answer.questionId === currentQuestionId)
        return currentQuestionAnswers
    }, [snapshot, currentQuestionId])

    const votesArray = useMemo(() => {
        return currentQuestionChoicesIds.map(choiceId => {
            return usersAnswers.filter(answer => answer.choiceId === choiceId).length
        })
    }, [usersAnswers, currentQuestionChoicesIds])

    const currentQuestionState = useMemo(() => {
        return snapshot?.currentQuestionState || 'answering'
    }, [snapshot])

    const myAnswers = useMemo(() => {
        if (!userId) return []
        return usersAnswers.filter(answer => answer.userId === userId)
    }, [usersAnswers, userId])

    const choicesStates = useMemo(() => {
        return currentQuestionChoicesIds.map(choiceId => {
            return myAnswers.some(answer => answer.choiceId === choiceId) ? 'selected' : 'unselected'
        })
    }, [myAnswers, currentQuestionChoicesIds])


    const setAnswerState = useCallback((index: number, value: 'selected' | 'unselected') => {
        if (!currentQuestionId) return
        const choiceId = currentQuestionChoicesIds[index]
        if (value === 'selected') {
            addAnswer(currentQuestionId, choiceId)
        } else {
            const answer = myAnswers.find(answer => answer.choiceId === choiceId)
            const answerId = snapshot?.answers ? Object.keys(snapshot.answers).find(key => snapshot.answers[key] === answer) : undefined
            if (answerId) {
                removeAnswer(answerId)
            }
        }
    }, [currentQuestionId, currentQuestionChoicesIds, addAnswer, removeAnswer, myAnswers, snapshot])



    return (
        <Container size='2' px='3' maxHeight='100%' overflow='scroll'>
            <Section size='2'>
                {/* <Dialog.Title align='center'>{questionText}</Dialog.Title> */}
				<Heading align='center'>{questionText}</Heading>
            </Section>

            <Section size='2'>
                <Flex direction='column' gap='3' mt='7' align='stretch'>
                    {currentQuestionChoices.map((choice, index) => (
                        <PollAnswerRow
                            key={`${index}-${choice.text}`}
                            text={choice.text}
                            votes={votesArray[index]}
                            questionState={currentQuestionState}
                            answerState={choicesStates[index]}
                            setAnswerState={(value) => setAnswerState(index, value)}
                        />
                    ))}
                </Flex>
            </Section>
        </Container>
    )
}