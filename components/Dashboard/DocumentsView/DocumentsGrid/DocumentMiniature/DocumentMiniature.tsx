import styles from './DocumentMiniature.module.css';
import Link from 'next/link';


export default function DocumentMiniature() {
    return (
        <Link href={'/creation'}   className={styles.container}>
            <div className={`${styles.mini} smallShadow`}></div>

            <h2 className={styles.title}>
                Titre de la présentation
            </h2>

            <legend className={styles.legend}>
                <p>Création : 01/01/2021</p>
                <p>Dernière session : 02/02/2023</p>
            </legend>

        </Link>
    )
}