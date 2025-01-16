import StudentForm from "./_components/StudentForm"
import { Card, Heading, Container, Section, Box } from "@radix-ui/themes"
import Image from "next/image"


export default function formPage() {
    return (
        <main style={{backgroundColor:'var(--accent-3)', minHeight:'100vh'}}>
            <Container size='1' p='1'>
                <Section>
                    <Card size='5'>
                        <Box position='relative' width='100%' height='200px'>
                            <Image src='/illustrations/door.svg' alt='rocket' layout='fill' objectFit='contain' />
                        </Box>
                        <Heading size='8' align='center' mb='5'>Bienvenue !</Heading>
                        <StudentForm />
                    </Card>
                </Section>
            </Container>
        </main>
    )
}