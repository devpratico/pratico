'use client'
import Popover from "@/app/[locale]/_components/primitives/Popover/Popover"
import Image from "next/image";
import QRCodeImage from "@/public/images/QRCode.png";
import PlainBtn from "@/app/[locale]/_components/primitives/buttons/PlainBtn/PlainBtn";
import { Clipboard } from "lucide-react";


interface QRCodeModalProps {
    children: React.ReactNode;
}

export default function QRCodeModal({ children }: QRCodeModalProps) {
    return (
        <Popover
            content={<Content />}
            align="center"
            side="bottom"
            arrow
        >
            {children}
        </Popover>
    )
}


function Content() {

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        //alignItems: 'center',
        padding: '1rem',
        gap: '1rem',
        backgroundColor: 'var(--background)',
        borderRadius: '10px',
        boxShadow: 'var(--big-shadow)',
    }


    return (
        <div style={containerStyle}>
            <Image src={QRCodeImage} width={200} height={200} alt="QR Code" />
            <PlainBtn color={'secondary'}  message={"Copier le lien"}><Clipboard/></PlainBtn>
        </div>
    )
}