'use client'
import { Section, RadioCards, Flex, Text, Box, Badge, Button } from '@radix-ui/themes'
import { ChevronLeft } from 'lucide-react'
import { Link } from '@/app/_intl/intlNavigation'
import useSearchParams from '@/app/_hooks/useSearchParams'


export default function DefilementMenu() {
    const { getPathnameWithSearchParam } = useSearchParams()


    return (

            <Section size='1'>


                <Button variant='ghost' size='2' mb='8' style={{boxSizing: 'border-box'}} asChild>
                    <Link href={getPathnameWithSearchParam('menu', 'participants')} shallow={false}>
                        <ChevronLeft />Participants
                    </Link>
                </Button>

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