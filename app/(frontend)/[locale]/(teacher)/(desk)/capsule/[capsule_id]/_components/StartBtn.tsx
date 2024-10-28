'use client'
import logger from "@/app/_utils/logger";
import { createRoom } from "@/app/(backend)/api/room/room.client";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
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
    
        setLoading(true)
        // Start the session and get the room that is created
        const { room: createdRoom, error} = await createRoom(capsuleId)

        // Redirect to the room page
        if (createdRoom) router.push(`/room/${createdRoom.code}`)
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