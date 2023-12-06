import styles from './MenuBar.module.css'

export default function MenuBar() {

    const leTitre = "Pratico";

    return (
        <header className={styles.menuBarContainer}>
            <h1>{leTitre}</h1>
        </header>
    )
}