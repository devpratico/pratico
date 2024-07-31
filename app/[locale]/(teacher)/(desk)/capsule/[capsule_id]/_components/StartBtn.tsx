'use client'
import logger from "@/app/_utils/logger";
import { createRoom } from "@/app/api/_actions/room2";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/_intl/intlNavigation";
import { Button, Box } from "@radix-ui/themes";
import { useState } from "react";
import { Play } from "lucide-react";


interface StartBtnProps {
    message?: string;
    variant?: "surface" | "outline" | "classic" | "solid" | "soft" | "ghost"
}

export default function StartBtn({ message, variant='surface' }: StartBtnProps) {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const router = useRouter()
    const [loading, setLoading] = useState(false)


    const handleClick = async () => {
        logger.log('react:component', 'Clicked start button', capsuleId)

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
            variant={variant}
            radius='large'
            loading={loading}
            disabled={!capsuleId}
            onClick={handleClick}
            style={{ boxShadow: 'none', ...(variant === 'surface' ? { backgroundColor: 'var(--background)'} : {}) }}
        >
            <Play size={15} strokeWidth='3' />
            {message}
        </Button>
    )
}