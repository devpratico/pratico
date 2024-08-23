'use client'
import { IconButton, Tooltip } from "@radix-ui/themes"
import { Play } from "lucide-react"
import { usePathname } from "@/app/_intl/intlNavigation"



export default function StartButton() {
    const pathname = usePathname()
    const inRoom = pathname.includes('/room/')


    return (
        <Tooltip content={inRoom ? 'Démarrer' : 'Lancez une session pour démarrer'}>
            <IconButton size='1' radius='full' disabled={!inRoom}>
                <Play size={15} />
            </IconButton>
        </Tooltip>
    )
}