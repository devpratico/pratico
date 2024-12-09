import { Section, Heading, Button } from "@radix-ui/themes"
import { ChevronLeft } from "lucide-react"
import ActivitiesTable from "./ActivitiesTable"
import SearchParamLink from "../../../SearchParamLink"


export default function AllQuizesMenu() {
    return (
        <>
            <Section size='1'>
                <SearchParamLink name='menu' value='activities'>
                    <Button variant='ghost'>
                        <ChevronLeft /> Activités
                    </Button>
                </SearchParamLink>
            </Section>

            <Section size='1'>
                <Heading size='3' trim='end' mb='2'>Mes quiz</Heading>
                <ActivitiesTable type='quiz' noneMessage='Aucun quiz'/>
            </Section>
        </>
    )
}