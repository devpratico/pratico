'use client'
import { IconButton} from "@radix-ui/themes";
import { QrCode } from 'lucide-react';
import { useMenus } from "@/app/[locale]/_hooks/useMenus";
import TooltipL from "@/app/[locale]/_components/TooltipL";


export default function QrButton() {

    const { setOpenDeskMenu } = useMenus()

    return (
        <TooltipL content='QR Code'>
            <IconButton onPointerDown={() => setOpenDeskMenu('qr')} variant='ghost' style={{color:'var(--background)'}}>
                <QrCode />
            </IconButton>
        </TooltipL>
    )

}

    