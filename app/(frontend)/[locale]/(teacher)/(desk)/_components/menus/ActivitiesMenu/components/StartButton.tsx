'use client'
import { IconButton, Tooltip } from "@radix-ui/themes"
import { Play } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import logger from "@/app/_utils/logger"
import { openPoll } from "@/app/(frontend)/_hooks/stores/usePollAnimation"



/**
 * Clicking this button generates an activity snapshot, and saves it in the room row.
 * It is not responsible for opening any activity view, as this is handled by the ActivityCard component.
 */
export default function StartButton({ activity_id }: { activity_id: number }) {
    const [loading, setLoading] = useState(false)
    const { room_code } = useParams<{ room_code?: string }>()
    const inRoom = !!room_code


    async function handleClick() {
        if (!inRoom) {
            logger.error('supabase:database', 'StartButton', 'Cannot start activity outside of a room')
            return
        }
        setLoading(true)
        await openPoll(activity_id)
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