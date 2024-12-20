'use client'
import { Container, Section, Flex, Heading } from "@radix-ui/themes"
import { PollAnswerRow } from "@/app/(frontend)/[locale]/(teacher)/(desk)/room/[room_code]/_components/PollAnimation"
import usePollParticipationStore from "@/app/(frontend)/_hooks/stores/usePollParticipationStore"
import usePollParticipationService from "@/app/(frontend)/_hooks/services/usePollParticipationService"


export default function PollAnswering() {
    // Store
    const poll = usePollParticipationStore(state => state.poll)
    const currentQuestionId = usePollParticipationStore(state => state.currentQuestionId)
    const questionText = poll?.questions.find(q => q.id === currentQuestionId)?.text
    const currentQuestionChoices = poll?.questions.find(q => q.id === currentQuestionId)?.choices || []
    const questionState = usePollParticipationStore(state => state.state)
    const answers = usePollParticipationStore(state => state.answers)

    // Service
    const { toggleVote, myChoicesIds, isPending } = usePollParticipationService()


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
                            votes={answers.filter(a => a.choiceId === choice.id).length}
                            questionState={questionState}
                            answerState={myChoicesIds.includes(choice.id) ? 'selected' : 'unselected'}
                            onClick={() => toggleVote(choice.id)}
                        />
                    ))}
                </Flex>
            </Section>
        </Container>
    )
}