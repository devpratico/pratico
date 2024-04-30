'use client'
import DeskMenuLayout from "./DeskMenuLayout/DeskMenuLayout"
import { Section, Heading, RadioCards } from '@radix-ui/themes'
import { Text, Flex, Table, Badge, Box } from "@radix-ui/themes"
import { usePresences } from "@/app/[locale]/_hooks/usePresences"
import { useUser } from "@/app/[locale]/_hooks/useUser"


export default function Participants() {

    const { presences } = usePresences()
    const { user } = useUser()

    return (
        <DeskMenuLayout menu="participants">
            <Section size='1'>
                <Heading size='3' as="h3" trim='both'>DÉFILEMENT</Heading>

                <RadioCards.Root defaultValue='2' columns='1'>
                    <RadioCards.Item value='1'  disabled={true}>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Pratico</Text>
                            <Text>Les participants peuvent consulter les pages précédentes</Text>
                        </Flex>
                        <Box position='absolute' top='2' right='2'>
                            <Badge color='gray'>Bientôt</Badge>
                        </Box>
                    </RadioCards.Item>
                    <RadioCards.Item value='2'>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Animateur</Text>
                            <Text>Les participants voient la page du formateur</Text>
                        </Flex>

                    </RadioCards.Item>
                    <RadioCards.Item value='3' disabled={true}>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Libre</Text>
                            <Text>Les participants ont accès à toutes les pages</Text>
                        </Flex>
                        <Box position='absolute' top='2' right='2'>
                            <Badge color='gray'>Bientôt</Badge>
                        </Box>
                    </RadioCards.Item>
                </RadioCards.Root>

            </Section>

            <Section size='1'>
                <Heading size='3' as="h3" trim='both'>PARTICIPANTS</Heading>

                <Table.Root>
                    <Table.Body>


                        {presences.map((presence, index) => {

                            const isMe = presence.id === user?.id

                            return(
                                <Table.Row key={presence.id}>
                                    <Table.RowHeaderCell>
                                        <Flex align='center' gap='2'>
                                            {Circle(presence.state == 'online' ? presence.color : 'lightgray')}
                                            {presence.firstName + ' ' + presence.lastName}
                                            {isMe && <Badge radius='full'>moi</Badge>}
                                            {presence.state == 'offline' && <Badge radius='full' color='gray'>hors ligne</Badge>}
                                        </Flex>
                                    </Table.RowHeaderCell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
                

            </Section>

        </DeskMenuLayout>
    )
}



function Circle(color: string) {
    return <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: color}}></div>
}