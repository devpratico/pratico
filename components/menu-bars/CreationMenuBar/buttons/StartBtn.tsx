'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/utils/logger";
import { useUi } from "@/hooks/uiContext";
import { startSession } from "@/actions/session";
import { useCapsule } from '@/hooks/capsuleContext';


interface StartBtnProps {
    message?: string;
}

export default function StartBtn({ message }: StartBtnProps) {

    const { setDeskMenuBarMode } = useUi()
    const { capsule } = useCapsule()
    const capsuleId = capsule?.id

    const handleClick = async () => {
        logger.log('react:component', 'Clicked start button')
        if (!capsuleId) return logger.error('supabase:database', 'No capsule id provided for start button')
        setDeskMenuBarMode('animation')
        await startSession(capsuleId)
    }

    return (
        <PlainBtn color="secondary" size="m" onClick={handleClick}>
            {message || "Start Session"}    
        </PlainBtn>
    )
}