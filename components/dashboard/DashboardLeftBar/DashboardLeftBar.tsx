import styles from './DashboardLeftBar.module.css';
import ListBtn from '@/components/primitives/buttons/ListBtn/ListBtn';
import { useTranslations } from 'next-intl';

export default function DashboardLeftBar() {
    const t = useTranslations('dashboard');

    return (
        <div className={styles.container}>
            <ListBtn title="Présentations" href="/" iconName={"file"} active={true}/>
            <ListBtn title="Quiz et sondages" href="/" iconName={"puzzle"} />
            <ListBtn title="Historique des sessions" href="/" iconName={"clock-rotate-left"} />
            <ListBtn title="Rapports" href="/" iconName={"file-lines"} />
            <div className={styles.spacer}></div>
            <ListBtn title={t('help')} href="/" iconName={"circle-question"} />
            <ListBtn title="Paramètres" href="/" iconName={"gear"} />
        </div>
    )
}