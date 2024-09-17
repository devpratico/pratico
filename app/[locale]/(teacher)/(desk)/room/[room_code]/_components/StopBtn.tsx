'use client'
import logger from "@/app/_utils/logger";
import { useRoom } from "@/app/_hooks/useRoom";
import { useRouter } from "@/app/_intl/intlNavigation";
import { Button } from "@radix-ui/themes";
import { stopRoom } from '@/app/api/actions/room';
import { useState } from "react";
import { useDisable } from "@/app/_hooks/useDisable";


interface StopBtnProps {
    message?: string;
    variant?: "surface" | "outline" | "classic" | "solid" | "soft" | "ghost"
}

export default function StopBtn({ message, variant='surface' }: StopBtnProps) {

    const router = useRouter()
    const { room } = useRoom()
    const [loading, setLoading] = useState(false)
    const { disabled, setDisabled } = useDisable()

    const roomId = room?.id
    const capsuleId = room?.capsule_id

    return(
        <Button
            variant={variant}
            radius='large'
            loading={loading}
            style={{ boxShadow: 'none', ...(variant === 'surface' ? { backgroundColor: 'var(--background)' } : {}) }}
            disabled={disabled}
            onClick={async () => { 
                setLoading(true)
                setDisabled(true)
                if (!roomId || !capsuleId) return
                try {
                    await stopRoom(roomId)
                    router.push(`/capsule/${capsuleId}`)
                } catch (error) {
                    logger.error('supabase:database', 'Error stopping session', error)
                } finally {
                    setDisabled(false)
                    //setLoading(false)
                }
            }}
        >
            {message}
        </Button>
    )
}