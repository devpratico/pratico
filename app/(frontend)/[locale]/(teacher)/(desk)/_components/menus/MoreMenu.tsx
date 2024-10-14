'use client'
import { Section, Callout, Box, Flex, VisuallyHidden } from '@radix-ui/themes'
import * as DialogPrimitive from '@radix-ui/react-dialog';
import StartBtn from '../../capsule/[capsule_id]/_components/StartBtn'
import StopBtn from '../../room/[room_code]/_components/StopBtn'
import { useParams } from 'next/navigation'

/**
 * Content of the 'More' menu that only shows on 'creation' phase (not during session)
 */
function CreationMenu() {
    return (
        <Flex display={{ initial: 'flex', xs: 'none' }} justify='center'>
            <StartBtn message='Lancer la session' variant='solid' />
        </Flex>
    )
}


/**
 * Content of the 'More' menu that only hsows during the session
 */
function AnimationMenu() {
    return (
        <Flex display={{ initial: 'flex', xs: 'none' }} justify='center'>
            <StopBtn message='Arrêter la session' variant='solid' />
        </Flex>
    )
}


export default function MoreMenu() {
    const params = useParams()
    const isRoom = params.room_code !== undefined

    return (
        <>
            <VisuallyHidden>
                <DialogPrimitive.Title>Plus</DialogPrimitive.Title>
                <DialogPrimitive.Description>{`Plus d'options`}</DialogPrimitive.Description>
            </VisuallyHidden>

            <Section size='1'>

                {isRoom ? <AnimationMenu /> : <CreationMenu />}

                <Box display={{ initial: 'none', xs: 'block' }}>
                    <Callout.Root variant='outline'>
                        <Callout.Text>
                            {`Ici, bientôt, vous retrouverez plus d'options !`}
                        </Callout.Text>
                    </Callout.Root>
                </Box>

            </Section>
        </>
    )
}