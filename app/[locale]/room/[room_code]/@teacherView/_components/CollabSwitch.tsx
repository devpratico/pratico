'use client'
import { IconButton } from '@radix-ui/themes'
import { Pen } from 'lucide-react'
import { useState, useEffect } from 'react'
import logger from '@/app/_utils/logger'
import { toggleCollaborationFor } from '@/app/[locale]/capsule/[capsule_id]/actions'
import { useRoom } from '@/app/[locale]/_hooks/useRoom'


interface SwitchIconProps {
    userId: string
    roomCode: string
}


export default function SwitchIcon({ userId, roomCode }: SwitchIconProps) {
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
        toggleCollaborationFor(userId, roomCode).then(() => { setLoading(false)})
    }

    return (
        <IconButton
            variant='ghost'
            color={active ? 'violet' : 'gray'}
            style={{opacity: active ? 1 : 0.3}}
            onClick={handleClick}
            loading={loading}
        >
            <Pen size='20'/>
        </IconButton>
    )
}