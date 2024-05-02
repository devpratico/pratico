import { Container, Heading, Callout } from '@radix-ui/themes';


export default function ActivitiesPage() {
    return (
        <main style={{ padding: '2rem' }}>
            <Container>
                <Heading as='h1'>Activités</Heading>
                <Callout.Root mt='4'>
                    <p>Vous retrouverez ici vos quizes, sondages, et bientôt de nouvelles activités !</p>
                </Callout.Root>
            </Container>
        </main>
    )
}