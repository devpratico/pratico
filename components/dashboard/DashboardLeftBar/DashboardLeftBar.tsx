'use server'
import styles from './DashboardLeftBar.module.css';
import ListBtn from '@/components/primitives/buttons/ListBtn/ListBtn';
import { getTranslations } from 'next-intl/server';

export default async function DashboardLeftBar() {
    const t = await getTranslations("dashboard")

    return (
        <div className={styles.container}>
            <ListBtn title={t('capsules')} href="/" iconName={"file"} active={true}/>
            <ListBtn title={t('quizzes and surveys')} href="/" iconName={"puzzle"} />
            <ListBtn title={t('reports')} href="/" iconName={"file-lines"} />
            <div className={styles.spacer}></div>
            <ListBtn title={t('help')} href="/" iconName={"circle-question"} />
            <ListBtn title={t('settings')} href="/" iconName={"gear"} />
        </div>
    )
}