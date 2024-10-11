import { Section, Callout, VisuallyHidden, Dialog } from '@radix-ui/themes'


export default function ChatMenu() {
    return (
        <>
            {/* <VisuallyHidden>
                <Dialog.Title>Chat</Dialog.Title>
                <Dialog.Description>Discutez avec les apprenants</Dialog.Description>
            </VisuallyHidden> */}

            <Section size='1'>

                <Callout.Root variant='outline'>
                    <Callout.Text>
                        Ici, bientôt, créez un chat avec vos apprenants !
                    </Callout.Text>
                </Callout.Root>

            </Section>
        </>
    )
}