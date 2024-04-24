'use client'
import DeskMenuLayout from "./DeskMenuLayout/DeskMenuLayout"
import { Section, Heading, RadioCards } from '@radix-ui/themes'
import { Text, Flex, Table } from "@radix-ui/themes"
import { usePresences } from "@/app/[locale]/_hooks/usePresences"
import { useUser } from "@/app/[locale]/_hooks/useUser"


export default function Participants() {

    const { presences } = usePresences()
    const { user } = useUser()

    return (
        <DeskMenuLayout menu="participants">
            <Section size='1'>
                <Heading size='3' as="h3" trim='both'>DÉFILEMENT</Heading>

                <RadioCards.Root defaultValue='1' columns='1'>
                    <RadioCards.Item value='1'>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Pratico</Text>
                            <Text>Explication</Text>
                        </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value='2'>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Animateur</Text>
                            <Text>Explication</Text>
                        </Flex>

                    </RadioCards.Item>
                    <RadioCards.Item value='3'>
                        <Flex direction='column' width='100%'>
                            <Text weight="bold">Libre</Text>
                            <Text>Explication</Text>
                        </Flex>
                    </RadioCards.Item>
                </RadioCards.Root>

            </Section>

            <Section size='1'>
                <Heading size='3' as="h3" trim='both'>PARTICIPANTS</Heading>

                <Table.Root>
                    {/*
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    */}

                    <Table.Body>


                        {presences.map((presence, index) => {

                            const name = presence.firstName + ' ' + presence.lastName
                            //const date = presence.connectedAt !== '' ? presence.connectedAt : presence.disconnectedAt
                            const isMe = presence.id === user?.id
                            const raw = (presence.state == 'online' ? '🟢 ' : '⚪️ ') + name + (isMe ? ' (moi)' : '')

                            return(
                                <Table.Row key={presence.id}>
                                    <Table.RowHeaderCell>{raw}</Table.RowHeaderCell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
                

            </Section>

        </DeskMenuLayout>
    )
}