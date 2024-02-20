import styles from './page.module.css'
import { getTranslations } from 'next-intl/server';
import { getUserId } from '@/supabase/services/auth';
import config from '@/stripe/stripe.config';

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
    const userId = await getUserId()

    return (
        <div className={styles.container}>
            <script async src="https://js.stripe.com/v3/pricing-table.js"/>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('subscribe to pratico')}</h1>
                <stripe-pricing-table
                    client-reference-id={userId}
                    pricing-table-id={config.pricingTableId[process.env.NODE_ENV]}
                    publishable-key={process.env.STRIPE_PUBLIC_KEY}
                />
            </div>
        </div>
    )
}