'use client'
import DeskMenuLayout from "@/app/[locale]/oldcapsule/[capsule_id]/_components/menus/DeskMenuLayout";
import { Section, Text, Flex, Table, Badge, Box, Button, SegmentedControl, Callout } from '@radix-ui/themes'
import { Pen, Coins, ChevronRight, Info, Telescope } from "lucide-react"
import { usePresences } from "@/app/_hooks/usePresences"
import CollabSwitch from "../CollabSwitch"
import CollabSwitchGlobal from "../CollabSwitchGlobal"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useMenus } from "@/app/_hooks/useMenus";


export default function ParticipantMenu() {
    const { room_code } = useParams() as { room_code: string }
    const { presences } = usePresences()
    const [tab, setTab] = useState<'collaborer' | 'recompenser'>('collaborer')
    const  { setOpenDeskMenu } = useMenus()

    return (
        <DeskMenuLayout menu="participants">
            <Section size='1'>

                {/*<Heading size='3' as="h3" mb='4' trim='both'>OPTIONS</Heading>*/}

                <Flex direction='column' gap='2'>
                    <Button variant='soft' size='3' color='gray' onClick={() => setOpenDeskMenu('defilement')}>
                        <Flex justify='between' align='center' width='100%'>
                            <Text wrap='nowrap'>Défilement</Text>
                            <Box flexGrow='1'/>
                            <Badge color='violet'>Animateur</Badge>
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

            </Section>

            <Section size='1'>
                {/*<Heading size='3' as="h3" mb='4' trim='both'>PARTICIPANTS</Heading>*/}

                <Box width='100%'>
                    <SegmentedControl.Root defaultValue='collaborer' size='2' value={tab} onValueChange={(value) => setTab(value as any)}>

                        <SegmentedControl.Item value='collaborer'>
                            <Flex align='center' gap='2'>
                                <Pen size='20' color='var(--pink)'/>
                                <Text>Collaborer</Text>
                            </Flex>
                        </SegmentedControl.Item>

                        <SegmentedControl.Item value='recompenser'>
                            <Flex align='center' gap='2'>
                                <Coins size='20' color='var(--orange)'/>
                                <Text>Récompenser</Text>
                            </Flex>
                        </SegmentedControl.Item>
                    </SegmentedControl.Root>
                </Box>


                {
                    tab == 'collaborer' && presences.length > 1 &&
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
                    tab == 'recompenser' && presences.length > 1 &&
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
                    presences.length < 2 &&
                    <Callout.Root mt='2' size='1'>
                        <Callout.Icon>
                            <Telescope size='20' />
                        </Callout.Icon>
                        <Callout.Text>
                            {`Aucun participant n'est connecté pour le moment.`}
                        </Callout.Text>
                    </Callout.Root>
                }


                {
                    tab == 'collaborer' && presences.length > 1 &&
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