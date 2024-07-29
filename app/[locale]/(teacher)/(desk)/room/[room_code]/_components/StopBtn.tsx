'use client'
import logger from "@/app/_utils/logger";
import { useRoom } from "@/app/_hooks/useRoom";
import { useRouter } from "@/app/_intl/intlNavigation";
import { Button } from "@radix-ui/themes";
import { stopRoom } from '@/app/api/_actions/room';
import { useState } from "react";
import { useDisable } from "@/app/_hooks/useDisable";


interface StopBtnProps {
    message?: string;
}

export default function StopBtn({ message }: StopBtnProps) {

    const router = useRouter()
    const { room } = useRoom()
    const [loading, setLoading] = useState(false)
    const { disabled, setDisabled } = useDisable()

    const roomId = room?.id
    const capsuleId = room?.capsule_id

    return(
        <Button
            variant='surface'
            radius='large'
            loading={loading}
            style={{ backgroundColor: 'var(--background)', boxShadow:'none' }}
            disabled={disabled}
            onClick={async () => { 
                setLoading(true)
                setDisabled(true)
                if (!roomId || !capsuleId) return
                try {
                    await stopRoom({ roomId, capsuleId })
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