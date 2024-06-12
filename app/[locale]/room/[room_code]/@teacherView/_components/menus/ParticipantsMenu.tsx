'use client'
import DeskMenuLayout from "../../../../../capsule/[capsule_id]/_components/menus/DeskMenuLayout/DeskMenuLayout"
import { Section, Heading, RadioCards, Text, Flex, Table, Badge, Box, Button, IconButton, Separator } from '@radix-ui/themes'
import { Pen, CircleDollarSign, Trophy, Coins, EllipsisVertical } from "lucide-react"
import { usePresences } from "@/app/[locale]/_hooks/usePresences"
import CollabSwitch from "../CollabSwitch"
import CollabSwitchGlobal from "../CollabSwitchGlobal"
import { useParams } from "next/navigation"


export default function ParticipantMenu() {
    const { room_code } = useParams() as { room_code: string }
    const { presences } = usePresences()

    return (
        <DeskMenuLayout menu="participants">
            <Section size='1'>
                <Heading size='3' as="h3" mb='2' trim='both'>DÉFILEMENT</Heading>

                <RadioCards.Root defaultValue='2' columns='1'>
                    <RadioCards.Item value='1'  disabled={true}>
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

            <Section size='1'>
                <Heading size='3' as="h3" mb='2' trim='both'>PARTICIPANTS</Heading>

                {/*
                <Flex direction='column' gap='1'>
                    <Button variant='soft'><Trophy />Équipes</Button>
                    <Button variant='soft'><Coins/>Récompenser</Button>
                    <Button variant='soft'><Pen/>Collaborer</Button>
                </Flex>
                */}

                <Table.Root>

                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell><CollabSwitchGlobal roomCode={room_code}/></Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {presences.map((presence, index) => {
                            return(
                                <Table.Row key={presence.id}>
                                    <Table.RowHeaderCell>
                                        <Flex align='center' gap='2'>
                                            {Circle(presence.state == 'online' ? presence.color : 'lightgray')}
                                            {presence.firstName + ' ' + presence.lastName}
                                            {presence.isMe && <Badge radius='full'>moi</Badge>}
                                            {presence.state == 'offline' && <Badge radius='full' color='gray'>hors ligne</Badge>}
                                            
                                            <div style={{flex: 1}}></div>
                                            {/*

                                            { !presence.isMe && presence.state == 'online' && <CollabSwitch userId={presence.id} roomCode={room_code} /> }
                                            */}

                                            {/*
                                            <IconButton variant='ghost'>
                                                <CircleDollarSign size='20' />
                                            </IconButton>

                                            <IconButton variant='ghost'>
                                                <EllipsisVertical size='20' />
                                            </IconButton>*/}
                                        </Flex>
                                    </Table.RowHeaderCell>

                                    <Table.Cell>
                                        {!presence.isMe && presence.state == 'online' && <CollabSwitch userId={presence.id} roomCode={room_code} />}
                                    </Table.Cell>
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