'use client'
import { DropdownMenu, Button } from "@radix-ui/themes"
import { useState } from "react"
import CardDialog from "../../CardDialog"
import QuizCreation from "../../activities/QuizCreation"
import PollCreation2 from "../../activities/PollCreation"
import { QuizProvider } from "@/app/(frontend)/_hooks/useQuiz"
import { PollProvider } from "@/app/(frontend)/_hooks/usePoll"
import { emptyQuiz } from "@/app/(frontend)/_hooks/useQuiz"
import { emptyPoll } from "@/app/(frontend)/_hooks/usePoll"


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
                    <DropdownMenu.Item onSelect={() => setOpenPollCreation(true)}>Sondage</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>


            <CardDialog preventClose open={openQuizCreation} onOpenChange={setOpenQuizCreation}>
                <QuizProvider quiz={emptyQuiz}>
                    <QuizCreation closeDialog={() => setOpenQuizCreation(false)} />
                </QuizProvider>
            </CardDialog>

            <CardDialog preventClose open={openPollCreation} onOpenChange={setOpenPollCreation}>
                <PollCreation2 />
            </CardDialog>
        </>
    )
}