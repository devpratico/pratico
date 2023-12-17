import styles from './DocumentsView.module.css';
import DocumentsGrid from './DocumentsGrid/DocumentsGrid';
import PlainBtn from '@/components/Primitives/Buttons/PlainBtn/PlainBtn';
import PToggleGroup from '@/components/Primitives/ToggleGroup/PToggleGroup';

export default function DocumentsView() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Présentations</h1>
            <div className={styles.buttons}>
                <PToggleGroup />
                <PlainBtn text="Créer" iconName="square-plus" style="violet" />
            </div>
            <DocumentsGrid/>
        </div>
    )
}