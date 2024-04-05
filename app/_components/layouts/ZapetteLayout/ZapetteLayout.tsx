import styles from './ZapetteLayout.module.css'


interface ZapetteLayoutProps {
    canvas:   React.ReactNode;
    toolBar:  React.ReactNode;
    controls: React.ReactNode;
    menuBar:  React.ReactNode;
}

export default function ZapetteLayout({ canvas, toolBar, controls, menuBar }: ZapetteLayoutProps) {
  return (
    <div className={styles.container}>

        <div className={styles.canvas}>
            {canvas}
        </div>

        <div className={styles.toolBar}>
            {toolBar}
        </div>
    
        <div className={styles.controls}>
            {controls}
        </div>
    
        <div className={styles.menuBar}>
            {menuBar}
        </div>
    
    </div>
  )
}