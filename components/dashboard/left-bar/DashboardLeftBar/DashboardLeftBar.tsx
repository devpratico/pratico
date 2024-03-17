import styles from './DashboardLeftBar.module.css';
//import ListBtn from '@/components/primitives/buttons/ListBtn/ListBtn';
import DashboardNavBtn from '../DashboardNavBtn/DashboardNavBtn';
import { getTranslations } from 'next-intl/server';

export default async function DashboardLeftBar() {
    const t = await getTranslations("dashboard")

    return (
        <div className={styles.container}>
            <DashboardNavBtn title={t('capsules')} href="/capsules"/>
            <DashboardNavBtn title={t('quizes and surveys')} href="/"/>
            <DashboardNavBtn title={t('reports')} href="/"/>
            <div className={styles.spacer}></div>
            <DashboardNavBtn title={t('help')} href="/"/>
            <DashboardNavBtn title={t('settings')} href="/settings"/>
        </div>
    )
}