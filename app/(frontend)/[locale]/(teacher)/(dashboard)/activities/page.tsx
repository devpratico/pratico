import { Container, Section, Heading, Callout } from '@radix-ui/themes';


export default function ActivitiesPage() {
    return (
        <Container px={{ initial: '3', xs: '0' }}>
            <Section>
                <Heading as='h1'>Activités</Heading>
                <Callout.Root mt='4'>
                    <p>Vous retrouverez ici vos quiz, sondages, et bientôt de nouvelles activités !</p>
                </Callout.Root>
            </Section>
        </Container>
    )
}