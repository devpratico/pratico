'use client'
import DeskMenuLayout from "../../../../../oldcapsule/[capsule_id]/_components/menus/DeskMenuLayout"
import { Section, Heading, Callout } from '@radix-ui/themes'


export default function ChatMenu() {

    return (
        <DeskMenuLayout menu="chat">
            <Section size='1'>
                <Heading size='3' as="h3" mb='2' trim='both'>CHAT</Heading>

                <Callout.Root variant='outline'>
                    <Callout.Text>
                        Ici, bientôt, créez un chat avec vos apprenants !
                    </Callout.Text>
                </Callout.Root>

            </Section>

        </DeskMenuLayout>
    )
}