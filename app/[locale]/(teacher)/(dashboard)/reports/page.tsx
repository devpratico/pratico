import { Container, Section, Heading, Callout } from '@radix-ui/themes';


export default function ReportsPage() {
    return (
        <Section px={{ initial: '3', xs: '0' }}>
            <Container>
                <Heading as='h1'>Rapports</Heading>
                <Callout.Root mt='4'>
                    <p>Vous retrouverez ici des rapports détaillés concernant vos sessions.</p>
                </Callout.Root>
            </Container>
        </Section>
    )
}