import styles from './DocumentsView.module.css';
import DocumentsGrid from '../DocumentsGrid/DocumentsGrid';
import PlainBtn from '@/components/primitives/buttons/PlainBtn/PlainBtn';
import PToggleGroup from '@/components/primitives/buttons/PToggleGroup/PToggleGroup';


export default function DocumentsView() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Présentations</h1>
            <div className={styles.buttons}>
                <PlainBtn text="Créer" iconName="square-plus" style="solid" />
                <PToggleGroup />
            </div>
            <DocumentsGrid/>
        </div>
    )
}