import { Container, Heading, Callout } from '@radix-ui/themes';


export default function ResourcesPage() {
    return (
        <main style={{ padding: '2rem' }}>
            <Container>
                <Heading as='h1'>Ressources</Heading>
                <Callout.Root mt='4'>
                    <p>Vous retrouverez ici des astuces, des tutoriels, ainsi que du contenu pour améliorer vos capsules !</p>
                </Callout.Root>
            </Container>
        </main>
    )
}