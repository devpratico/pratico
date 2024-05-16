'use client'
import { IconButton } from '@radix-ui/themes'
import { Pen } from 'lucide-react'
import { useState } from 'react'
import logger from '@/app/_utils/logger'
import { toggleCollaborationFor } from '@/app/[locale]/capsule/[capsule_id]/actions'


interface SwitchIconProps {
    userId: string
    roomCode: string
}


export default function SwitchIcon({ userId, roomCode }: SwitchIconProps) {
    const [active, setActive] = useState(false)

    function handleClick() {
        setActive(!active)
        logger.log('react:component', 'CollabSwitch clicked', { userId, active: !active })
        toggleCollaborationFor(userId, roomCode)
    }

    return (
        <IconButton
            variant='ghost'
            color={active ? 'violet' : 'gray'}
            style={{opacity: active ? 1 : 0.3}}
            onClick={handleClick}
        >
            <Pen size='20'/>
        </IconButton>
    )
}