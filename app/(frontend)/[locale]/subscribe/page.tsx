import styles from './page.module.css'
import { getTranslations } from 'next-intl/server';
import { fetchUser } from '@/app/(backend)/api/actions/user';
import config from '@/app/(backend)/api/stripe/(receive-webhook-event)/stripe.config';
import { redirect } from '@/app/(frontend)/_intl/intlNavigation';

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
    }
}


export default async function SubScribePage() {
    const t = await getTranslations("subscribe")
    // On passe l'id de l'utilisateur à stripe afin de pouvoir facilement le retrouver parmis
    // les events émis par le webhook de stripe.
    const { user, error } = await fetchUser()

    if (error || !user) {
        redirect('/auth?nextUrl=/subscribe')
        return null
    }

    return (
        <div className={styles.container}>
            <script async src="https://js.stripe.com/v3/pricing-table.js"/>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('subscribe to pratico')}</h1>
                <stripe-pricing-table
                    client-reference-id={user.id}
                    pricing-table-id={config.pricingTableId[process.env.NODE_ENV]}
                    publishable-key={process.env.STRIPE_PUBLIC_KEY}
                />
            </div>
        </div>
    )
}