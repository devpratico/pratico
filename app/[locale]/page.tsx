import styles from './page.module.css'
import Link from "next/link"


export default function HomePage() {
    return (
        <div className={styles.container}>
            <h1>👋</h1>
            <h1 className={styles.title}>Bonjour</h1>
            <p>Je suis la landing page de pratico. (Bientôt).</p>
            <Link className={styles.link} href="/capsules">Capsules</Link>
        </div>
    )
}