import styles from './DocumentsView.module.css';
import DocumentsGrid from './DocumentsGrid/DocumentsGrid';
import PlainBtn from '@/components/Buttons/PlainBtn/PlainBtn';

export default function DocumentsView() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Supports</h1>
                <PlainBtn text="Créer un support" iconName="square-plus" style="violet" />
            </div>
            <DocumentsGrid/>
        </div>
    )
}