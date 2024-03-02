'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/utils/logger";
import { useUi } from "@/hooks/uiContext";
import { stopSession } from "@/actions/session";
import { useRoom } from "@/hooks/roomContext";


interface StopBtnProps {
    message?: string;
}


export default function StopBtn({ message }: StopBtnProps) {

    const { setDeskMenuBarMode } = useUi()
    const { room } = useRoom()
    const roomId = room?.id

    const handleClick = () => {
        if (!roomId) return logger.error('supabase:database', 'No capsule id provided for stop button')
        logger.log('react:component', 'Clicked stop button')
        setDeskMenuBarMode('creation')
        try {
            stopSession(roomId)
        } catch (error) {
            logger.error('supabase:database', 'Error stopping session', error)
        }
    }


    return (
        <PlainBtn color="secondary" size="m" onClick={handleClick}>
            {message || "Stop Session"}    
        </PlainBtn>
    )
}