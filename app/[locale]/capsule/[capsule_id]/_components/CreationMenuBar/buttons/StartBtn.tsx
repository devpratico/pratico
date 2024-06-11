'use client'
import logger from "@/app/_utils/logger";
import { createRoom } from "@/app/[locale]/capsule/[capsule_id]/actions";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/_intl/intlNavigation";
import { Button } from "@radix-ui/themes";
import { useState } from "react";


interface StartBtnProps {
    message?: string;
}

export default function StartBtn({ message }: StartBtnProps) {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    

    const handleClick = async () => {
        logger.log('react:component', 'Clicked start button')

        if (!capsuleId) return logger.error('supabase:database', 'No capsule id provided for start button')
        try {
            setLoading(true)
            // Start the session and get the room that is created
            const createdRoom = await createRoom(capsuleId)
            
            // Redirect to the room page
            router.push(`/room/${createdRoom.code}`)
        } catch (error) {
            logger.error('supabase:database', 'Error starting session', (error as Error).message)
        }
    }
    return (
        <Button
            variant='surface'
            radius='large'
            style={{ backgroundColor: 'var(--background)' }}
            loading={loading}
            onClick={handleClick}
        >
            {message}
        </Button>
    )
}