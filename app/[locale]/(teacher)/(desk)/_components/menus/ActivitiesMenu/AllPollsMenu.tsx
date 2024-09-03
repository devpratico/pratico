import { Section, Heading, Button } from "@radix-ui/themes"
import { ChevronLeft } from "lucide-react"
import ActivitiesTable from "./ActivitiesTable"
import SearchParamLink from "../../SearchParamLink"
import CreateSpecificActivityBtn from "./CreateSpecificActivityBtn"
import { ActivityType } from "@/app/_hooks/usePollQuizCreation"


export default function AllPollsMenu() {
    return (
        <>
            <Section size='1'>
                <SearchParamLink name='menu' value='activities'>
                    <Button variant='ghost'>
                        <ChevronLeft /> Activités
                    </Button>
                </SearchParamLink>
            </Section>
            <CreateSpecificActivityBtn type="poll" />
            <Section size='1'>
                <Heading size='3' trim='end' mb='2'>Mes sondages</Heading>
                <ActivitiesTable type='poll' noneMessage='Aucun sondage'/>
            </Section>
        </>
    )
}