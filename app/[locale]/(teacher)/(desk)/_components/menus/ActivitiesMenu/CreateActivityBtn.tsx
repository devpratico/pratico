'use client'
import { DropdownMenu, Button } from "@radix-ui/themes"
import { useState } from "react"
import { emptyQuiz, emptyPoll } from "@/app/_hooks/usePollQuizCreation"
import CardDialog from "../../CardDialog"
import QuizCreation from "../../activities/QuizCreation"
import PollCreation from "../../activities/PollCreation"
import { QuizCreationProvider, PollCreationProvider } from "@/app/_hooks/usePollQuizCreation"


export default function CreateActivityBtn() {
    const [openQuizCreation, setOpenQuizCreation] = useState(false)
    const [openPollCreation, setOpenPollCreation] = useState(false)

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button>Créer une activité<DropdownMenu.TriggerIcon /></Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content align='end'>
                    <DropdownMenu.Item onSelect={() => setOpenQuizCreation(true)}>Quiz</DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => setOpenPollCreation(true)} disabled>Sondage</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>


            <CardDialog preventClose open={openQuizCreation} setOpen={setOpenQuizCreation}>
                <QuizCreationProvider initialQuiz={emptyQuiz}>
                    <QuizCreation closeDialog={() => setOpenQuizCreation(false)} />
                </QuizCreationProvider>
            </CardDialog>

            <CardDialog preventClose open={openPollCreation} setOpen={setOpenPollCreation}>
                <PollCreationProvider initialPoll={emptyPoll}>
                    <PollCreation closeDialog={() => setOpenPollCreation(false)} />
                </PollCreationProvider>
            </CardDialog>
        </>
    )
}