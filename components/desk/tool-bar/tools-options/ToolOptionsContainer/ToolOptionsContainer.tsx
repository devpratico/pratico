import styles from './ToolOptionsContainer.module.css'

interface ToolOptionsContainerProps {
    children: React.ReactNode;
    rows?: number;
}


export default function ToolOptionsContainer({children, rows=4}: ToolOptionsContainerProps) {
    return (
        <div className={styles.container} style={{'--tool-options-rows': rows} as React.CSSProperties}>
            {children}
        </div>
    )
}