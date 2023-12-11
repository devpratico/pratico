import styles from './Miniature.module.css'


interface MiniatureProps {
    selected?: boolean
}

export default function Miniature({ selected }: MiniatureProps) {

    const style = `${styles.container} ${selected ? styles.selected : ""}`

    return (
        <div className={style}></div>
    )
}