import { Container, Section, Box, Heading, Flex, Button } from "@radix-ui/themes"
import Image from "next/image"
import { FileDown } from "lucide-react"



export default function Page({ params }: { params: { room_id: string } }) {
    return (
        <Container>
            <Section>
                <Box position='relative' width='100%' height='400px'>
                    <Image src='/illustrations/finished.svg' alt='rocket' layout='fill' objectFit='contain' />
                </Box>
                <Heading size='8' align='center' mb='5'>Session terminée</Heading>
            </Section>

            {/* <Section>
                <Flex direction='column' justify='center' gap='5' align='center'>
                    <Button size='4'><FileDown/>Télécharger le support en pdf</Button>
                    <Button variant='ghost' color='gray'>Signaler un problème</Button>
                </Flex>
            </Section> */}
        </Container>
    )
}