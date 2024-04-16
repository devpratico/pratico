import styles from './DeskLayout.module.css'


interface DeskLayoutProps {
    menuBar?:  React.ReactNode;
    toolBar?:  React.ReactNode;
    carousel?: React.ReactNode;
    controls?: React.ReactNode;
    menu?:     React.ReactNode;
    canvas?:   React.ReactNode;
}

/**
 * This layout is used to position the custom ui components of the desk.
 */
export default function DeskLayout({menuBar, toolBar, carousel, controls, menu, canvas}: DeskLayoutProps) {
    return (
        <div className={styles.container}>

            <div className={styles.canvas}>
                {canvas}
            </div>

            { menuBar &&
                <div className={styles.menuBar}>
                    {menuBar}
                </div>
            }

            { toolBar &&
                <div className={styles.toolBar}>
                    {toolBar}
                </div>
            }

            { carousel &&
                <div className={styles.carousel}>
                    {carousel}
                </div>
            }

            { controls &&
                <div className={styles.controls}>
                    {controls}
                </div>
            }

            { menu &&
                <div className={styles.menu}>
                    {menu}
                </div>
            }

        </div>
    )
}