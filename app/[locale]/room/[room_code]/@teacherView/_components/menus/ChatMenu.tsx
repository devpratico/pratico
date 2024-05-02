'use client'
import DeskMenuLayout from "../../../../../capsule/[capsule_id]/_components/menus/DeskMenuLayout/DeskMenuLayout"
import { Section, Heading, Callout } from '@radix-ui/themes'


export default function ChatMenu() {

    return (
        <DeskMenuLayout menu="chat">
            <Section size='1'>
                <Heading size='3' as="h3" trim='both'>CHAT</Heading>

                <Callout.Root variant='outline'>
                    <Callout.Text>
                        Ici, bientôt, créez un chat avec vos apprenants !
                    </Callout.Text>
                </Callout.Root>

            </Section>

        </DeskMenuLayout>
    )
}