'use client'
import { DropdownMenu, Button } from "@radix-ui/themes"
import usePollCreationStore from "../../../../../../../_hooks/stores/usePollCreationStore"
import useQuizCreationStore from "@/app/(frontend)/_hooks/stores/useQuizCreationStore"
import { emptyPoll  } from "@/domain/entities/activities/poll"


export default function CreateActivityBtn() {
    const openPoll = usePollCreationStore(state => state.openPoll)
    const openQuiz = useQuizCreationStore(state => state.openEmptyQuiz)

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button>Créer une activité<DropdownMenu.TriggerIcon /></Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content align='end'>
                <DropdownMenu.Item onSelect={openQuiz}>Quiz</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => openPoll({poll: emptyPoll})}>Sondage</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}