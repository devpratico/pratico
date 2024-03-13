'use server'
import styles from './DeskLayout.module.css'


interface DeskLayoutProps {
    menuBar?: React.ReactNode;
    toolBar?: React.ReactNode;
    carousel?: React.ReactNode;
    controls?: React.ReactNode;
    menu?: React.ReactNode;
}

/**
 * This layout is used to position the custom ui components of the desk.
 */
export default async function DeskLayout({menuBar, toolBar, carousel, controls, menu}: DeskLayoutProps) {
    return (
        <div className={styles.container}>

            <div className={styles.menuBar}>
                {menuBar}
            </div>

            <div className={styles.toolBar}>
                {toolBar}
            </div>

            <div className={styles.carousel}>
                {carousel}
            </div>

            <div className={styles.controls}>
                {controls}
            </div>

            <div className={styles.menu}>
                {menu}
            </div>
        </div>
    )
}