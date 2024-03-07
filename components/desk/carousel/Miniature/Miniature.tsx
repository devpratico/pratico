import styles from './Miniature.module.css'


export interface MiniatureProps {
    selected?: boolean
    children?: React.ReactNode
}

export default function Miniature({ selected, children }: MiniatureProps) {
    const style = `${styles.container} smallShadow ${selected ? styles.selected : ""}`
    return <div className={style}>{children}</div>
}