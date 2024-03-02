import styles from './page.module.css'
import DocumentsGrid from '@/components/dashboard/DocumentsGrid/DocumentsGrid';
//import PToggleGroup from '@/components/primitives/buttons/PToggleGroup/PToggleGroup';
import { getTranslations } from 'next-intl/server';
import { CreateCapsuleBtn } from './buttons';


export default async function CapsulesPage() {
    const t = await getTranslations("dashboard")
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('capsules')}</h1>
            <div className={styles.buttons}>
                <CreateCapsuleBtn />
                {/*<PToggleGroup />*/}
            </div>
            <DocumentsGrid/>
        </div>
    )
}