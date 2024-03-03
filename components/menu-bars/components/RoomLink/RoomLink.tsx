'use client'
import { useRoom } from '@/hooks/roomContext';


export default function RoomLink() {
    const { room } = useRoom()
    const roomName = room?.name

    return (
        <span>{'path/' + roomName}</span>
    )
}