import { Heading, Flex, Callout, Button, Box } from "@radix-ui/themes"
import { customerIsSubscribed } from "@/app/(backend)/api/stripe/stripe.server"
import { Gift, Star, Gem } from "lucide-react"
import { Link } from "@/app/(frontend)/_intl/intlNavigation"
import config from "@/app/(backend)/api/stripe/stripe.config"


type Plan = 'free' | 'pro' | 'entreprise'
type State = { activePlan: Plan }

async function getState(): Promise<State> {
    return {
        activePlan: await customerIsSubscribed() ? 'pro' : 'free'
    }
}


/** Allows to easily put a list in a Callout */
function CalloutList({items}: {items: string[]}) {
    return (
        <ul>
            {items.map((item, index) => <li key={index}><Callout.Text>{item}</Callout.Text></li>)}
        </ul>
    )
}


function FreePlan({active=false}: {active?: boolean}) {
    return (
        <Callout.Root variant={active ? 'surface' : 'outline'} color={active ? undefined : 'gray'}>
            <Callout.Icon><Gift color='var(--pink-9)' /></Callout.Icon>
            <Heading size='3'>Pratico Free</Heading>
            <CalloutList items={[
                'Toutes les fonctionnalités de Pratico',
                'Limite de 10 participants par session'
            ]}/>

        </Callout.Root>
    )
}

function ProPlan({ active=false }: { active?: boolean }) {
    const planUrl = config.customerPortalUrl[process.env.NODE_ENV]

    return (
        <Callout.Root variant={active ? 'surface' : 'outline'} color={active ? undefined : 'gray'}>

            <Callout.Icon><Star color='var(--amber-10)'/></Callout.Icon>
            <Heading size='3'>Pratico Pro</Heading>

            <CalloutList items={['Toutes les fonctionnalités de Pratico sans restrictions']}/>

            <Box display={active ? 'none' : 'block'}>
                <Button asChild color='amber'>
                    <Link href='/subscribe' target="_blank">S&apos;abonner</Link>
                </Button>
            </Box>

            <Box display={active ? 'block' : 'none'}>
                <Button asChild color='violet'>
                    <Link href={planUrl} target="_blank">Gérer son abonnement</Link>
                </Button>
            </Box>


        </Callout.Root>
    )
}

function EntreprisePlan({ active=false }: { active?: boolean }) {
    return (
        <Callout.Root variant={active ? 'surface' : 'outline'} color={active ? undefined : 'gray'}>
            <Callout.Icon><Gem color='var(--blue-9)' /></Callout.Icon>
            <Heading size='3'>Pratico Entreprise</Heading>
            <CalloutList items={[
                'Toutes les fonctionnalités de Pratico Pro',
                'Accès à des fonctionnalités avancées',
                'Accompagnement personnalisé'
            ]}/>
            <Box>
                <Button asChild color='blue'>
                    <Link href='https://www.pratico.live' target="_blank">Nous contacter</Link>
                </Button>
            </Box>
        </Callout.Root>
    )
}


export default async function StripeSettings() {
    const { activePlan } = await getState()

    return (
        <Flex gap='5' direction='column'>
            <FreePlan active={activePlan === 'free'} />
            <ProPlan active={activePlan === 'pro'} />
            <EntreprisePlan />
        </Flex>
    )
}