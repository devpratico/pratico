import styles from './page.module.css'
import DocumentsGrid from '@/app/[locale]/(dashboard)/capsules/_components/DocumentsGrid/DocumentsGrid';
import { getTranslations } from 'next-intl/server';
import { CreateCapsuleBtn } from './_components/buttons';


export const revalidate = 0

export default async function CapsulesPage() {
    const t = await getTranslations("dashboard")
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('capsules')}</h1>
            <div className={styles.buttons}>
                <CreateCapsuleBtn />
            </div>
            <DocumentsGrid/>
        </div>
    )
}