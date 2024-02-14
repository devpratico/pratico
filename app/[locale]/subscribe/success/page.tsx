import styles from './page.module.css'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'


export default async function SuccessPage() {
    const t = await getTranslations("subscribe")

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>{t('thanks for subscribing')}</h1>
                <Link href="/capsules">{t("start using pratico")}</Link>
            </div>
        </div>
    )
}