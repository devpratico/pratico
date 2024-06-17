'use client'
import { IconButton, Tooltip } from "@radix-ui/themes";
import { QrCode } from 'lucide-react';
import { useMenus } from "@/app/[locale]/_hooks/useMenus";


export default function QrButton() {

    const { setOpenDeskMenu } = useMenus()

    return (
        <Tooltip content='QR Code'>
            <IconButton onPointerDown={() => setOpenDeskMenu('qr')} variant='ghost' style={{color:'var(--background)'}}>
                <QrCode />
            </IconButton>
        </Tooltip>
    )

}

    