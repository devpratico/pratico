'use client'
import { IconButton } from '@radix-ui/themes'
import { Pen, PenOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import logger from '@/app/_utils/logger'
import { toggleCollaborationFor } from '../_actions/actions'
import { useRoom } from '@/app/_hooks/useRoom'
import TooltipL from '@/app/[locale]/_components/TooltipL'


interface CollabSwitchProps {
    userId: string
    roomCode: string
}


export default function CollabSwitch({ userId, roomCode }: CollabSwitchProps) {
    const { room } = useRoom()
    const [loading, setLoading] = useState(false)
    
    // Collaboration:
    const _params = room?.params?.collaboration
    const isActive =  _params?.active
    const isForAll =  _params?.allowAll
    const isAllowed = _params?.allowedUsersIds.includes(userId)
    const [active, setActive] = useState(isActive && (isForAll || isAllowed))

    useEffect(() => {
        setActive(isActive && (isForAll || isAllowed))
    }, [isActive, isForAll, isAllowed])

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
                {active ? <Pen size='20' color='var(--pink)'/> : <PenOff size='20'/>}
            </IconButton>
        </TooltipL>
    )
}