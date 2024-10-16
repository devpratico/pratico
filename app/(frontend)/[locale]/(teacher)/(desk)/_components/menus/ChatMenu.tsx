import { Section, Callout, VisuallyHidden } from '@radix-ui/themes'
import * as DialogPrimitive from '@radix-ui/react-dialog';


export default function ChatMenu() {
    return (
        <>
            <VisuallyHidden>
                <DialogPrimitive.Title>Chat</DialogPrimitive.Title>
                <DialogPrimitive.Description>Discutez avec les apprenants</DialogPrimitive.Description>
            </VisuallyHidden>

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