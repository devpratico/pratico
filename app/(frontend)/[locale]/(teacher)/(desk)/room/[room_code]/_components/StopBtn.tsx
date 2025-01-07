'use client'
import logger from "@/app/_utils/logger";
import { useRoom } from "@/app/(frontend)/_hooks/useRoom";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Button } from "@radix-ui/themes";
import { stopRoom } from "@/app/(backend)/api/room/room.client";
import { useState } from "react";
import { useDisable } from "@/app/(frontend)/_hooks/useDisable";
import createClient from "@/supabase/clients/client";
import { Radio } from "lucide-react";

interface StopBtnProps {
    message?: string;
    variant?: "surface" | "outline" | "classic" | "solid" | "soft" | "ghost"
}

export default function StopBtn({ message, variant='surface' }: StopBtnProps) {

    const router = useRouter()
	const supabase = createClient();
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
                    
                    const end_of_session = new Date().toISOString()
                    const { error } = await supabase.from('rooms').update({end_of_session}).eq('id', roomId);
                    if (error)
                        logger.error('supabase:database', 'Error stopping session', error);
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
            <Radio color="var(--red-9)" /> 
            {message}
        </Button>
    )
}