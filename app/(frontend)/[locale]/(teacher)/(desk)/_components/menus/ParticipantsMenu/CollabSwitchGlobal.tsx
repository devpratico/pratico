'use client'
import { IconButton } from '@radix-ui/themes'
import { Pen } from 'lucide-react'
import { useState, useEffect } from 'react'
import logger from '@/app/_utils/logger'
import { toggleCollaborationForAll } from '@/app/(backend)/api/room/room.client'
import { useRoom } from '@/app/(frontend)/_hooks/contexts/useRoom'
import { usePresences } from '@/app/(frontend)/_hooks/contexts/usePresences'
import TooltipL from '@/app/(frontend)/[locale]/_components/TooltipL'


interface CollabSwitchGlobalProps {
    roomCode: string
}


export default function CollabSwitchGlobal({ roomCode }: CollabSwitchGlobalProps) {
    const { room } = useRoom()
    const [loading, setLoading] = useState(false)
    const { presences } = usePresences()
    
    // Collaboration:
    const _params = room?.params?.collaboration
    const isActive =  _params?.active
    const isForAll =  _params?.allowAll

    const [active, setActive] = useState(isActive && isForAll)

    useEffect(() => {
        setActive(isActive && isForAll)
    }, [isActive, isForAll])

    function handleClick() {
        setLoading(true)
        logger.log('react:component', 'CollabSwitchGlobal clicked', { active: !active })
        const allUsersIds = presences.map(p => p.id)
        toggleCollaborationForAll({roomCode, allUsersIds}).then(() => { setLoading(false)})
    }

    return (
        <TooltipL content={active ? 'Désactiver la collaboration pour tous' : 'Activer la collaboration pour tous'}>
            <IconButton
                variant='ghost'
                color={active ? 'pink' : 'gray'}
                style={{opacity: active ? 1 : 0.3}}
                onClick={handleClick}
                loading={loading}
            >
                <Pen size='20'/>
            </IconButton>
        </TooltipL>
    )
}