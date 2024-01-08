import styles from './DocumentsGrid.module.css';
import DocumentMiniature from './DocumentMiniature/DocumentMiniature';

export default function DocumentsGrid() {
    return (
        <div className={styles.grid}>
            <DocumentMiniature/>
            <DocumentMiniature/>
            <DocumentMiniature/>
            <DocumentMiniature/>
            <DocumentMiniature/>
            <DocumentMiniature/>
            <DocumentMiniature/>
        </div>
    )
}
