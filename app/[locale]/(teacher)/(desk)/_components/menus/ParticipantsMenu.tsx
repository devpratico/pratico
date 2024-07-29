'use client'
import { Section, Text, Flex, Table, Badge, Box, Button, SegmentedControl, Callout } from '@radix-ui/themes'
import { Pen, Coins, ChevronRight, Info, Telescope } from "lucide-react"
import { usePresences } from "@/app/_hooks/usePresences"
import CollabSwitch from "./ui/CollabSwitch"
import CollabSwitchGlobal from "./ui/CollabSwitchGlobal"
import { useParams, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Link, usePathname } from '@/app/_intl/intlNavigation'
import { hrefFor } from '../MenuTabs'


export default function ParticipantMenu() {
    const { room_code } = useParams() as { room_code: string }
    const { presences } = usePresences()
    const [tab, setTab] = useState<'collaborer' | 'recompenser'>('collaborer')
    const pathName = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        console.log(presences)
    }, [presences])

    return (
        <>
            <Section size='1'>

                <Flex direction='column' gap='2'>

                    <Button variant='soft' size='3' color='gray' asChild>
                        <Link href={hrefFor(searchParams, pathName, 'defilement')} shallow={true}>
                            <Flex justify='between' align='center' width='100%'>
                                <Text wrap='nowrap'>Défilement</Text>
                                <Box flexGrow='1'/>
                                <Badge color='violet'>Animateur</Badge>
                                <ChevronRight/>
                            </Flex>
                        </Link>
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


                <SegmentedControl.Root defaultValue='collaborer' size='2' value={tab} style={{ width: '100%' }} onValueChange={(value) => setTab(value as any)}>
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

        </>
    )
}



function Circle(color: string) {
    return <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: color}}></div>
}