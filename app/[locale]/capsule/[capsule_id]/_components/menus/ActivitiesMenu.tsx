'use client'
import DeskMenuLayout from "./DeskMenuLayout/DeskMenuLayout"
import { Section, Heading, Callout } from '@radix-ui/themes'
import { Star } from "lucide-react"



export default function ActivitiesMenu() {

    return (
        <DeskMenuLayout menu="polls">
            <Section size='1'>
                <Heading size='3' as="h3" mb='2' trim='both'>ACTIVITÉS</Heading>

                <Callout.Root variant='outline'>
                    <Callout.Text>
                        Ici, bientôt, gérez vos quiz et sondages, et bien plus encore !
                    </Callout.Text>
                </Callout.Root>
            </Section>

        </DeskMenuLayout>
    )
}