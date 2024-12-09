'use client'
import { DropdownMenu, Button } from "@radix-ui/themes"
import { useState } from "react"
import CardDialog from "../../../CardDialog"
import QuizCreation from "./QuizCreation"
import PollCreation from "./PollCreation"
import { QuizProvider } from "@/app/(frontend)/_hooks/useQuiz"
import { PollProvider } from "@/app/(frontend)/_hooks/usePoll"
import { emptyQuiz } from "@/app/(frontend)/_hooks/useQuiz"
//import { emptyPoll } from "@/app/(frontend)/_hooks/usePoll"
import usePollCreation from "../../../../../../../_stores/usePollCreation"
import { mockPoll, emptyPoll  } from "@/app/_types/poll2"


export default function CreateActivityBtn() {
    const [openQuizCreation, setOpenQuizCreation] = useState(false)
    const openPoll = usePollCreation(state => state.openPoll)

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button>Créer une activité<DropdownMenu.TriggerIcon /></Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content align='end'>
                    <DropdownMenu.Item onSelect={() => setOpenQuizCreation(true)}>Quiz</DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => openPoll({poll: emptyPoll})}>Sondage</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>


            <CardDialog preventClose open={openQuizCreation} onOpenChange={setOpenQuizCreation}>
                <QuizProvider quiz={emptyQuiz}>
                    <QuizCreation closeDialog={() => setOpenQuizCreation(false)} />
                </QuizProvider>
            </CardDialog>
        </>
    )
}