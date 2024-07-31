import { Section, Callout, Box, Flex } from '@radix-ui/themes'
import StartBtn from '../../capsule/[capsule_id]/_components/StartBtn'


export default function MoreMenu() {

    return (
        <Section size='1'>
            <Flex display={{ initial: 'flex', xs: 'none' }} justify='center'>
                <StartBtn message='lancer la session' variant='solid'/>
            </Flex>

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