/*
	This page is not used yet.
*/
import { Container, Section, Heading, Callout, ScrollArea } from '@radix-ui/themes';


export default function ResourcesPage() {
    return (
        <ScrollArea>
            <Container>
                <Section px={{ initial: '3', xs: '0' }}>
                    <Heading as='h1'>Ressources</Heading>
                    <Callout.Root mt='4'>
                        <p>Vous retrouverez ici des astuces, des tutoriels, ainsi que du contenu pour améliorer vos capsules !</p>
                    </Callout.Root>
                </Section>
            </Container>
        </ScrollArea>
    )
}