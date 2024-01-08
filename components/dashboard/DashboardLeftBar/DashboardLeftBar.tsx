import styles from './DashboardLeftBar.module.css';
import ListBtn from '@/components/primitives/buttons/ListBtn/ListBtn';

export default function DashboardLeftBar() {
    return (
        <div className={styles.container}>
            <ListBtn title="Présentations" href="/" iconName={"file"} active={true}/>
            <ListBtn title="Quiz et sondages" href="/" iconName={"puzzle"} />
            <ListBtn title="Historique des sessions" href="/" iconName={"clock-rotate-left"} />
            <ListBtn title="Rapports" href="/" iconName={"file-lines"} />
            <div className={styles.spacer}></div>
            <ListBtn title="Aide" href="/" iconName={"circle-question"} />
            <ListBtn title="Paramètres" href="/" iconName={"gear"} />
        </div>
    )
}