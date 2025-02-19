'use client'
import { IconButton } from '@radix-ui/themes'
import { Pen, PenOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import logger from '@/app/_utils/logger'
import { toggleCollaborationFor } from '@/app/(backend)/api/room/room.client'
import { useRoom } from '@/app/(frontend)/_hooks/contexts/useRoom'
import TooltipL from '@/app/(frontend)/[locale]/_components/TooltipL'


interface CollabSwitchProps {
    userId: string
    roomCode: string
}


export default function CollabSwitch({ userId, roomCode }: CollabSwitchProps) {
    const { room } = useRoom()
    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(false)
    
    useEffect(() => {
        if (!room?.params) return;
        const _params = room.params.collaboration;
        const isActive = _params.active;
        const isForAll = _params.allowAll;
        const isAllowed = _params.allowedUsersIds.includes(userId);

        setActive(isActive && (isForAll || isAllowed));
    }, [room, userId]);



    function handleClick() {
        setLoading(true)
        logger.log('react:component', 'CollabSwitch clicked', { userId, active: !active })
        toggleCollaborationFor({userId, roomCode}).then(() => { setLoading(false)})
    }

    return (
        <TooltipL content={active ? 'Désactiver la collaboration' : 'Activer la collaboration'}>
            <IconButton
                variant='ghost'
                color={active ? 'pink' : 'gray'}
                style={{opacity: active ? 1 : 0.3}}
                onClick={handleClick}
                loading={loading}
            >
                {active ? <Pen size='20'/> : <PenOff size='20'/>}
            </IconButton>
        </TooltipL>
    )
}