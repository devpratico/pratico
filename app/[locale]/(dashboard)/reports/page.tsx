import { Container, Heading, Callout } from '@radix-ui/themes';


export default function ReportsPage() {
    return (
        <main style={{ padding: '2rem' }}>
            <Container>
                <Heading as='h1'>Rapports</Heading>
                <Callout.Root mt='4'>
                    <p>Vous retrouverez ici des rapports détaillés concernant vos sessions.</p>
                </Callout.Root>
            </Container>
        </main>
    )
}