import styles from './ParticipantRow.module.css'


interface ParticipantRowProps {
    color: string
    name: string
}

export default function ParticipantRow({ color, name }: ParticipantRowProps) {
    return (
        <div className={styles.container}>
            <div className={styles.color} style={{ backgroundColor: color }}></div>
            {name}
        </div>
    )
}
