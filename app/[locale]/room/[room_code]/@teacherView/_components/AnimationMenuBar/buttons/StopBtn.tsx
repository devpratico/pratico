'use client'
import PlainBtn from "@/app/[locale]/_components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/app/_utils/logger";
import { stopRoom } from "@/app/[locale]/capsule/[capsule_id]/_actions/capsuleActions";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import { useRouter } from "@/app/_intl/intlNavigation";


interface StopBtnProps {
    message?: string;
}


export default function StopBtn({ message }: StopBtnProps) {

    const router = useRouter()
    const { room } = useRoom()
    const roomId = room?.id

    const handleClick = async () => {
        if (!roomId) return logger.error('supabase:database', 'No room id provided for stop button')
        logger.log('react:component', 'Clicked stop button')
        try {
            await stopRoom(roomId)
            logger.log('supabase:database', 'Session stopped')
            //router.refresh()
            // Redirect to the capsule page
            router.push(`/capsule/${room.capsule_id}`)
        } catch (error) {
            logger.error('supabase:database', 'Error stopping session', error)
        }
    }


    return (
        <PlainBtn color="secondary" size="m" onClick={handleClick} message={message || "Stop Session"} />
    )
}