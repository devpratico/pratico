'use client'
import { Portal } from "@radix-ui/themes"
import { useState, useEffect } from "react"


export default function TopBarPortal({children}: {children: React.ReactNode}) {
    const [container, setContainer] = useState<HTMLElement | null>(null)

    useEffect(() => {
        setContainer(document.getElementById('top-bar-box'))
    }, [])

    return (
        <Portal container={container}>
            {children}
        </Portal>
    )
}