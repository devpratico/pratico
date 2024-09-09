'use client'
import { IconButton, Tooltip } from "@radix-ui/themes"
import { Play } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { startActivity } from "@/app/api/_actions/room"


/**
 * Clicking this button generates an activity snapshot, and saves it in the room row.
 * It is not responsible for opening any activity view, as this is handled by the ActivityCard component.
 */
export default function StartButton({ activity_id }: { activity_id: number }) {
    const [loading, setLoading] = useState(false)
    const { room_code } = useParams<{ room_code?: string }>()
    const inRoom = !!room_code

    async function handleClick() {
        if (!inRoom) return
        setLoading(true)
        const { error } = await startActivity({ activityId: activity_id, roomCode: room_code })
        setLoading(false)
    }

    return (
        <Tooltip content={inRoom ? 'Démarrer' : 'Lancez une session pour démarrer'}>
            <IconButton size='1' radius='full' disabled={!inRoom} onClick={handleClick} loading={loading}>
                <Play size={15} />
            </IconButton>
        </Tooltip>
    )
}