'use client'
import { Section, Callout, Box, Flex } from '@radix-ui/themes'
import StartBtn from '../../capsule/[capsule_id]/_components/StartBtn'
import { useParams } from 'next/navigation'

/**
 * Content of the 'More' menu that only shows on 'creation' phase (not during session)
 */
function CreationMenu() {
    return (
        <Flex display={{ initial: 'flex', xs: 'none' }} justify='center'>
            <StartBtn message='lancer la session' variant='solid' />
        </Flex>
    )
}


/**
 * Content of the 'More' menu that only hsows during the session
 */
function AnimationMenu() {
    return null
}


export default function MoreMenu() {
    const params = useParams()
    const isRoom = params.room_code !== undefined

    return (
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
    )
}