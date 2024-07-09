'use client'
import logger from "@/app/_utils/logger";
import { createRoom } from "@/app/[locale]/capsule/[capsule_id]/actions";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/_intl/intlNavigation";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import { useDisable } from "@/app/[locale]/_hooks/useDisable";


interface StartBtnProps {
    message?: string;
}

export default function StartBtn({ message }: StartBtnProps) {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { disabled, setDisabled } = useDisable()
    

    const handleClick = async () => {
        logger.log('react:component', 'Clicked start button')
        setLoading(true)
        setDisabled(true)

        if (!capsuleId) return logger.error('supabase:database', 'No capsule id provided for start button')

        try {
            // Start the session and get the room that is created
            const createdRoom = await createRoom(capsuleId)
            // Redirect to the room page
            router.push(`/room/${createdRoom.code}`)

        } catch (error) {
            logger.error('supabase:database', 'Error starting session', (error as Error).message)
        }

        setLoading(false)
        setDisabled(false)
    }

    
    return (
        <Button
            variant='surface'
            radius='large'
            style={{ backgroundColor: 'var(--background)', boxShadow:'none' }}
            loading={loading}
            onClick={handleClick}
            disabled={disabled}
        >
            {message}
        </Button>
    )
}