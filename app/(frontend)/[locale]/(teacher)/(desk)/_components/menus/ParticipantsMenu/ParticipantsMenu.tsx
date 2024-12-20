'use client'
import { Section, Text, Flex, Table, Badge, Box, Button, SegmentedControl, Callout, VisuallyHidden, Strong } from '@radix-ui/themes'
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Pen, Coins, ChevronRight, Info, TriangleAlertIcon } from "lucide-react"
import { usePresences } from "@/app/(frontend)/_hooks/contexts/usePresences"
import CollabSwitch from "./CollabSwitch"
import CollabSwitchGlobal from "./CollabSwitchGlobal"
import { useParams } from "next/navigation"
import useSearchParams from '@/app/(frontend)/_hooks/contexts/useSearchParams'
import { useState } from "react"
import { Link } from '@/app/(frontend)/_intl/intlNavigation'
import { useUser } from '@/app/(frontend)/_hooks/contexts/useUser';
import GoPremiumBtn from '../../../../_components/GoPremiumBtn';


export default function ParticipantMenu() {
    const { room_code } = useParams() as { room_code: string }
    const { presences } = usePresences()
    const [tab, setTab] = useState<'collaborer' | 'recompenser'>('collaborer')
    const { getPathnameWithSearchParam } = useSearchParams()
    const { isSubscribed } = useUser()

    return (
        <>
            <VisuallyHidden>
                <DialogPrimitive.Title>Participants</DialogPrimitive.Title>
                <DialogPrimitive.Description>La liste des participants</DialogPrimitive.Description>
            </VisuallyHidden>

            <Section size='1'>

                <Flex direction='column' gap='2'>

                    <Box display={isSubscribed ? 'none' : 'block'}>
                        <Callout.Root color='amber' size='1' mb='6' variant='surface'>
                            <Callout.Icon><TriangleAlertIcon/></Callout.Icon>
                            <Callout.Text>
                                Le nombre de participants est limité à <Strong>10</Strong>.
                            </Callout.Text>
                            <GoPremiumBtn/>
                        </Callout.Root>
                    </Box>

                    {/* <Button variant='soft' asChild>
                        <Link href={getPathnameWithSearchParam('menu', 'defilement')} shallow={true}>
                            <Flex justify='between' align='center' width='100%'>
                                <Text wrap='nowrap'>Défilement</Text>
                                <Box flexGrow='1'/>
                                <Badge>Animateur</Badge>
                                <ChevronRight/>
                            </Flex>
                        </Link>
                    </Button> */}

                    {/* <Button variant='soft' disabled>
                        <Flex justify='between' align='center' width='100%'>
                            <Text wrap='nowrap' >Créer des équipes</Text>
                            <Box flexGrow='1'/>
                            <Badge color='gray'>Bientôt</Badge>
                            <ChevronRight />
                        </Flex>
                    </Button> */}
                </Flex>

            </Section>

            <Section size='1'>


                {/* <SegmentedControl.Root defaultValue='collaborer' size='2' value={tab} style={{ width: '100%' }} onValueChange={(value) => setTab(value as any)}>
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
                </SegmentedControl.Root> */}



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
                            Bientôt, vous pourrez récompenser les participants.
                        </Callout.Text>
                    </Callout.Root>
                }

                {
                    presences.length < 2 &&
                    <Callout.Root mt='2' size='1' color='gray'>
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