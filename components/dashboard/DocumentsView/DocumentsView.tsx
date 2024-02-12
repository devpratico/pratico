'use server'
import styles from './DocumentsView.module.css';
import DocumentsGrid from '../DocumentsGrid/DocumentsGrid';
import PToggleGroup from '@/components/primitives/buttons/PToggleGroup/PToggleGroup';
import { getTranslations } from 'next-intl/server';


export default async function DocumentsView() {
    const t = await getTranslations("dashboard")
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('capsules')}</h1>
            <div className={styles.buttons}>
                <PToggleGroup />
            </div>
            <DocumentsGrid/>
        </div>
    )
}