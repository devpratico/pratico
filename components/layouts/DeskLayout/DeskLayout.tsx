import styles from './DeskLayout.module.css'


interface DeskLayoutProps {
    menuBar?: React.ReactNode;
    toolBar?: React.ReactNode;
    slideBar?: React.ReactNode;
    menu?: React.ReactNode;
}

/**
 * This layout is used to position the custom ui components of the desk.
 */
export default function DeskLayout({menuBar, toolBar, slideBar, menu}: DeskLayoutProps) {
    return (
        <div className={styles.container}>

            <div className={styles.menuBar}>
                {menuBar}
            </div>

            <div className={styles.toolBar}>
                {toolBar}
            </div>

            <div className={styles.slideBar}>
                {slideBar}
            </div>

            <div className={styles.menu}>
                {menu}
            </div>
        </div>
    )
}