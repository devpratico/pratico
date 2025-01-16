import { Container, Section, Callout } from '@radix-ui/themes';


export default function ActivitiesPage() {
    return (
        <Container px={{ initial: '3', xs: '0' }}>
            <Section>
                <Callout.Root mt='4'>
                    <p>Vous retrouverez ici vos quiz, sondages, et bientôt de nouvelles activités !</p>
                </Callout.Root>
            </Section>
        </Container>
    )
}