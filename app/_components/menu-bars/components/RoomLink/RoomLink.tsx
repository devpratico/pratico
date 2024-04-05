'use client'
import styles from './RoomLink.module.css'
import { useRoom } from '@/app/_hooks/useRoom';
import QRCodeModal from '@/app/[locale]/capsule/[capsule_id]/_components/QRCodeModal';


export default function RoomLink() {
    const { room } = useRoom()
    const roomName = room?.code

    return (
        <div className={styles.link}>
            <QRCodeModal>
                <span className={styles.path}>{'.live/'}</span>
                <span className={styles.code}>{roomName}</span>
            </QRCodeModal>
        </div>
    )
}