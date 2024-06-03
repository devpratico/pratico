'use client'
import { IconButton } from "@radix-ui/themes";
import { QrCode } from 'lucide-react';
import { useMenus } from "@/app/[locale]/_hooks/useMenus";


export default function QrButton() {

    const { setOpenDeskMenu } = useMenus()

    return (
        <IconButton onClick={() => setOpenDeskMenu('qr')}>
            <QrCode />
        </IconButton>
    )

}

    