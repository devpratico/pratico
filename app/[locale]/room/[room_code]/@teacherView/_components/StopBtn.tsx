'use client'
import logger from "@/app/_utils/logger";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import { useRouter } from "@/app/_intl/intlNavigation";
import { Button } from "@radix-ui/themes";
import { stopRoom } from '../_actions/actions';
import { useState } from "react";


interface StopBtnProps {
    message?: string;
}

export default function StopBtn({ message }: StopBtnProps) {

    const router = useRouter()
    const { room } = useRoom()
    const [loading, setLoading] = useState(false)

    const roomId = room?.id
    const capsuleId = room?.capsule_id

    return(
        <Button
            variant='surface'
            radius='large'
            loading={loading}
            style={{ backgroundColor: 'var(--background)' }}
            onClick={async () => { 
                setLoading(true)
                if (!roomId || !capsuleId) return
                try {
                    await stopRoom({ roomId, capsuleId })
                    router.push(`/capsule/${capsuleId}`)
                } catch (error) {
                    logger.error('supabase:database', 'Error stopping session', error)
                    setLoading(false)
                }
            }}
        >
            {message}
        </Button>
    )
}