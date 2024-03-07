'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/utils/logger";
import { stopRoom } from "@/actions/capsuleActions";
import { useRoom } from "@/hooks/roomContext";
import { useRouter } from "next/navigation";


interface StopBtnProps {
    message?: string;
}


export default function StopBtn({ message }: StopBtnProps) {

    const router = useRouter()
    const { room, setRoom } = useRoom()
    const roomId = room?.id

    const handleClick = async () => {
        if (!roomId) return logger.error('supabase:database', 'No room id provided for stop button')
        logger.log('react:component', 'Clicked stop button')
        try {
            await stopRoom(roomId)
            setRoom(undefined)
            logger.log('supabase:database', 'Session stopped')
            router.refresh()
        } catch (error) {
            logger.error('supabase:database', 'Error stopping session', error)
        }
    }


    return (
        <PlainBtn color="secondary" size="m" onClick={handleClick} message={message || "Stop Session"} />
    )
}