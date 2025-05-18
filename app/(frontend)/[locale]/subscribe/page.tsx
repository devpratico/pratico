import styles from './page.module.css'
import { getTranslations } from 'next-intl/server';
import { fetchUser } from '@/app/(backend)/api/user/user.server';
import config from '@/app/(backend)/api/stripe/stripe.config';
import { redirect } from '@/app/(frontend)/_intl/intlNavigation';
import { Container, Section, Card, Heading, Text } from '@radix-ui/themes';

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
    }
}


export default async function SubScribePage() {
    // On passe l'id de l'utilisateur à stripe afin de pouvoir facilement le retrouver parmis
    // les events émis par le webhook de stripe.
    const { user, error } = await fetchUser()

    // If no user or user is anonymous, redirect to the auth page
    if (error || !user || user.is_anonymous) {
        redirect('/auth?authTab=signup&nextUrl=/subscribe')
        return null
    }

    return (
        <main style={{backgroundColor: 'var(--accent-2)', minHeight:'100dvh'}}>
            <Container size='2'  p='3'>
                <Section>
                    <Heading mb='3'>S&apos;abonner à Pratico</Heading>
                    <Card variant='classic'>
                        <script async src="https://js.stripe.com/v3/pricing-table.js"/>
                        <stripe-pricing-table
                            client-reference-id={user.id}
                            pricing-table-id={config.pricingTableId[process.env.NODE_ENV]}
                            publishable-key={process.env.STRIPE_PUBLIC_KEY}
                        />
                    </Card>
                    <Text size='1' color='gray' align='center'>La version gratuite est limitée à 3 participants par session.</Text>
                </Section>
            </Container>
        </main>
    )
}