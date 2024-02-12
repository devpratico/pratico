import styles from './DocumentMiniature.module.css';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';


export default async function DocumentMiniature() {
    const t = await getTranslations("dashboard")
    return (
        <Link href={'/creation'}   className={styles.container}>
            <div className={`${styles.mini} smallShadow`}></div>

            <h2 className={styles.title}>
                Titre de la présentation
            </h2>

            <legend className={styles.legend}>
                <p>{`${t('creation')} : 01/01/2021`}</p>
                <p>{`${t('last session')} : 02/02/2023`}</p>
            </legend>

        </Link>
    )
}