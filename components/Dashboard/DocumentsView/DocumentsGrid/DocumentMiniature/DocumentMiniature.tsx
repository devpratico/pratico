import styles from './DocumentMiniature.module.css';
import Link from 'next/link';


export default function DocumentMiniature() {
    return (
        <Link href={'/creation'}   className={styles.container}>
            <div className={styles.mini}></div>
            <h2 className={styles.title}>
                Titre du support
            </h2>

            <legend className={styles.legend}>
                <p>Création : 01/01/2021</p>
                <p>Dernière session : 02/02/2023</p>
            </legend>

        </Link>
    )
}