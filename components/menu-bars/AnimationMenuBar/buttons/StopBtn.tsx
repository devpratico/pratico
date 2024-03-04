'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/utils/logger";
import { useUi } from "@/hooks_i/uiContext";
import { stopRoom } from "@/actions/capsuleActions";
import { useRoom } from "@/hooks_i/roomContext";


interface StopBtnProps {
    message?: string;
}


export default function StopBtn({ message }: StopBtnProps) {

    const { setDeskMenuBarMode } = useUi()
    const { room, setRoom } = useRoom()
    const roomId = room?.id

    const handleClick = async () => {
        if (!roomId) return logger.error('supabase:database', 'No room id provided for stop button')
        logger.log('react:component', 'Clicked stop button')
        setDeskMenuBarMode('creation')
        try {
            await stopRoom(roomId)
            setRoom(undefined)
            logger.log('supabase:database', 'Session stopped')
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