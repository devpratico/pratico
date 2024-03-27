import styles from './DocumentMiniature.module.css';
import { getTranslations, getFormatter } from 'next-intl/server';


interface DocumentMiniatureProps {
    title?: string;
    createdAt?: Date;
    children?: React.ReactNode;
}

export default async function DocumentMiniature({ title, createdAt, children }: DocumentMiniatureProps) {
    const t = await getTranslations("dashboard")
    const formatter = await getFormatter()

    let localeDate: string = '?'
    if (createdAt) {
        localeDate = formatter.dateTime(new Date(createdAt), { day: 'numeric', month: 'long', year: 'numeric' })
    }
    
    return (
        <div  className={styles.container}>
            <div className={`${styles.mini} smallShadow`}>
                {children}
            </div>

            <h2 className={styles.title}>
                {title || t('untitled')}
            </h2>

            <legend className={styles.legend}>
                <p>{`${t('creation')} : ${localeDate}`}</p>
                {/*<p>{`${t('last session')} : 02/02/2023`}</p>*/}
            </legend>

        </div>
    )
}