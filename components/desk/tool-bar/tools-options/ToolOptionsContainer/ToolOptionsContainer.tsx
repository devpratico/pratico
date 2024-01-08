import styles from './ToolOptionsContainer.module.css'


export default function ToolOptionsContainer({children}: {children: React.ReactNode}) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}