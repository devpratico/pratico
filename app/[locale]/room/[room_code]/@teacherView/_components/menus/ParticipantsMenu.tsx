'use client'
import DeskMenuLayout from "../../../../../capsule/[capsule_id]/_components/menus/DeskMenuLayout"
import { Section, Heading, RadioCards, Text, Flex, Table, Badge, Box, Button, IconButton, Separator, SegmentedControl, Callout } from '@radix-ui/themes'
import { Pen, CircleDollarSign, Trophy, Coins, EllipsisVertical, ChevronRight, Info } from "lucide-react"
import { usePresences } from "@/app/[locale]/_hooks/usePresences"
import CollabSwitch from "../CollabSwitch"
import CollabSwitchGlobal from "../CollabSwitchGlobal"
import { useParams } from "next/navigation"
import { useState } from "react"


export default function ParticipantMenu() {
    const { room_code } = useParams() as { room_code: string }
    const { presences } = usePresences()
    const [tab, setTab] = useState<'collaborer' | 'recompenser'>('collaborer')

    return (
        <DeskMenuLayout menu="participants">
            <Section size='1'>

                <Flex direction='column' gap='2'>
                    <Button variant='soft' size='3' color='gray'>
                        <Flex justify='between' align='center' width='100%'>
                            <Text wrap='nowrap'>Défilement</Text>
                            <Box flexGrow='1'/>
                            <Badge color='violet'>Pratico</Badge>
                            <ChevronRight/>
                        </Flex>
                    </Button>

                    <Button variant='soft' size='3' disabled>
                        <Flex justify='between' align='center' width='100%'>
                            <Text wrap='nowrap' >Créer des équipes</Text>
                            <Box flexGrow='1'/>
                            <Badge color='gray'>Bientôt</Badge>
                            <ChevronRight />
                        </Flex>
                    </Button>
                </Flex>

                {/*<Heading size='3' as="h3" mb='2' trim='both'>DÉFILEMENT</Heading>*/}

                


                {/*
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
                */}

            </Section>

            <Section size='1'>
                {/*<Heading size='3' as="h3" mb='2' trim='both'>PARTICIPANTS</Heading>*/}

                <Box width='100%'>
                    <SegmentedControl.Root defaultValue='collaborer' size='2' value={tab} onValueChange={(value) => setTab(value as any)}>

                        <SegmentedControl.Item value='collaborer'>
                            <Flex align='center' gap='2'>
                                <Pen size='20'/>
                                <Text>Collaborer</Text>
                            </Flex>
                        </SegmentedControl.Item>

                        <SegmentedControl.Item value='recompenser'>
                            <Flex align='center' gap='2'>
                                <Coins size='20'/>
                                <Text>Récompenser</Text>
                            </Flex>
                        </SegmentedControl.Item>
                    </SegmentedControl.Root>
                </Box>


                {
                    tab == 'collaborer' &&
                    <Callout.Root mt='2' size='1'>
                        <Callout.Icon>
                            <Info size='20' />
                        </Callout.Icon>
                        <Callout.Text>
                            En cliquant sur le crayon, vous permettez à un participant de modifier le contenu de la page.
                        </Callout.Text>
                    </Callout.Root>
                }

                {
                    tab == 'recompenser' &&
                    <Callout.Root mt='2' size='1'>
                        <Callout.Icon>
                            <Info size='20' />
                        </Callout.Icon>
                        <Callout.Text>
                            Bientôt, vous pourrez récompenser les participants pour leur participation.
                        </Callout.Text>
                    </Callout.Root>
                }


                {
                    tab == 'collaborer' &&
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
                }
                

            </Section>

        </DeskMenuLayout>
    )
}



function Circle(color: string) {
    return <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: color}}></div>
}