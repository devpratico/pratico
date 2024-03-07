import styles from './ParticipantRow.module.css'


interface ParticipantRowProps {
    color: string
    name?: string
    surname?: string
    nickname?: string
}

export default function ParticipantRow({ color, name, surname, nickname }: ParticipantRowProps) {
    return (
        <div className={styles.container}>
            <div className={styles.color} style={{ backgroundColor: color }}></div>
            {`${name} ${surname} - ${nickname}`}
        </div>
    )
}
