import { Section, Heading, Callout } from '@radix-ui/themes'


export default function MoreMenu() {

    return (
        <Section size='1'>
            <Heading size='3' as="h3" mb='2' trim='both'>OPTIONS</Heading>

            <Callout.Root variant='outline'>
                <Callout.Text>
                    {`Ici, bientôt, vous retrouverez plus d'options !`}
                </Callout.Text>
            </Callout.Root>

        </Section>
    )
}