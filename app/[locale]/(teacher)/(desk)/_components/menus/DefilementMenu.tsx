import { Section, Heading, RadioCards, Flex, Text, Box, Badge, Button } from '@radix-ui/themes'
import { ChevronLeft } from 'lucide-react'


export default function DefilementMenu() {
    return (

            <Section size='1'>

                <Button variant='ghost' size='2' mb='8' style={{boxSizing: 'border-box'}}>
                    <ChevronLeft />Participants
                </Button>

                <Heading size='3' as="h3" mb='4' trim='both'>DÉFILEMENT</Heading>

                <RadioCards.Root defaultValue='2' columns='1'>
                    <RadioCards.Item value='1' disabled={true}>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Pratico</Text>
                            <Text color='gray'>Les participants peuvent consulter les pages précédentes</Text>
                        </Flex>
                        <Box position='absolute' top='2' right='2'>
                            <Badge color='gray'>Bientôt</Badge>
                        </Box>
                    </RadioCards.Item>
                    <RadioCards.Item value='2'>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Animateur</Text>
                            <Text color='gray'>Les participants voient la page du formateur</Text>
                        </Flex>

                    </RadioCards.Item>
                    <RadioCards.Item value='3' disabled={true}>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Libre</Text>
                            <Text color='gray'>Les participants ont accès à toutes les pages</Text>
                        </Flex>
                        <Box position='absolute' top='2' right='2'>
                            <Badge color='gray'>Bientôt</Badge>
                        </Box>
                    </RadioCards.Item>
                </RadioCards.Root>
            </Section>
    )
}