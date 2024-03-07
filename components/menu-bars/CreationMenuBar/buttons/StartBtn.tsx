'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/utils/logger";
import { createRoom } from "@/actions/capsuleActions";
import { useCapsule } from '@/hooks/capsuleContext';
import { useRoom } from "@/hooks/roomContext";


interface StartBtnProps {
    message?: string;
}

export default function StartBtn({ message }: StartBtnProps) {
    const { capsule } = useCapsule()
    const capsuleId = capsule?.id
    const { setRoom } = useRoom()

    const handleClick = async () => {
        logger.log('react:component', 'Clicked start button')
        if (!capsuleId) return logger.error('supabase:database', 'No capsule id provided for start button')
        try {
            // Start the session and get the room that is created
            const createdRoom = await createRoom(capsuleId)
            // Set the room in the context
            setRoom(createdRoom)
        } catch (error) {
            logger.error('supabase:database', 'Error starting session', (error as Error).message)
        }
    }

    return <PlainBtn color="secondary" size="m" onClick={handleClick} message={message || "Start Session"} />
}