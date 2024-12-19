'use client'
import { IconButton, Tooltip } from "@radix-ui/themes"
import { Play } from "lucide-react"
import { useParams } from "next/navigation"
import logger from "@/app/_utils/logger"
import { useStartPollService } from "@/app/(frontend)/_hooks/services/usePollAnimationService"



/**
 * Clicking this button generates an activity snapshot, and saves it in the room row.
 * It is not responsible for opening any activity view, as this is handled by the ActivityCard component.
 */
export default function StartButton({ activity_id }: { activity_id: number }) {
    // TODO: get rid of the room_code param and use it in the service hook
    const { room_code } = useParams<{ room_code?: string }>()
    const inRoom = !!room_code
    const { startPoll, isPending } = useStartPollService()


    async function handleClick() {
        const { error } = await startPoll(activity_id)
        if (error) {
            logger.error('supabase:database', 'StartButton.tsx', 'Error starting poll', error)
        }
    }

    return (
        <Tooltip content={inRoom ? 'Démarrer' : 'Lancez une session pour démarrer'}>
            <IconButton size='1' radius='full' disabled={!inRoom} onClick={handleClick} loading={isPending}>
                <Play size={15} />
            </IconButton>
        </Tooltip>
    )
}