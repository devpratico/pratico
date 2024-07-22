import { Container, Section, Heading, Callout } from '@radix-ui/themes';


export default function ResourcesPage() {
    return (
        <Section px={{ initial: '3', xs: '0' }}>
            <Container>
                <Heading as='h1'>Ressources</Heading>
                <Callout.Root mt='4'>
                    <p>Vous retrouverez ici des astuces, des tutoriels, ainsi que du contenu pour améliorer vos capsules !</p>
                </Callout.Root>
            </Container>
        </Section>
    )
}