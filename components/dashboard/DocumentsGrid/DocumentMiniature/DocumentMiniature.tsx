import styles from './DocumentMiniature.module.css';
import { getTranslations } from 'next-intl/server';


interface DocumentMiniatureProps {
    title: string;
}

export default async function DocumentMiniature({ title }: DocumentMiniatureProps) {
    const t = await getTranslations("dashboard")
    return (
        <div  className={styles.container}>
            <div className={`${styles.mini} smallShadow`}></div>

            <h2 className={styles.title}>
                {title}
            </h2>

            <legend className={styles.legend}>
                <p>{`${t('creation')} : 01/01/2021`}</p>
                <p>{`${t('last session')} : 02/02/2023`}</p>
            </legend>

        </div>
    )
}