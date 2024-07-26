'use client'
import { Section, Heading, Callout } from '@radix-ui/themes'


export default function ActivitiesMenu() {
    return (
        <Section size='1'>
            <Heading size='3' as="h3" mb='2' trim='both'>ACTIVITÉS</Heading>

            <Callout.Root variant='outline'>
                <Callout.Text>
                    Ici, bientôt, gérez vos quiz et sondages, et bien plus encore !
                </Callout.Text>
            </Callout.Root>
        </Section>
    )
}