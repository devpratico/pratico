'use client'
import styles from './RoomLink.module.css'
import { useRoom } from '@/hooks/roomContext';


export default function RoomLink() {
    const { room } = useRoom()
    const roomName = room?.code

    return (
        <div className={styles.link}>
            <span className={styles.path}>{'.live/'}</span>
            <span className={styles.code}>{roomName}</span>
        </div>
    )
}