'use client'
import { useMenus } from '@/app/[locale]/_hooks/useMenus'
import type { DeskMenu } from '@/app/[locale]/_hooks/useMenus'
import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';


interface DeskMenuLayoutProps {
    menu: DeskMenu;
    children: React.ReactNode;
}

export default function DeskMenuLayout({ menu, children }: DeskMenuLayoutProps) {
    const { openedDeskMenu, setOpenDeskMenu } = useMenus()
    const [overlayContainer, setOverlayContainer] = useState<HTMLElement | null>(null)

    useEffect(() => {
        setOverlayContainer(document.getElementById('canvasArea'))
    }, [])

    return (
        <Dialog.Root
            open={openedDeskMenu === menu}
            onOpenChange={open => setOpenDeskMenu(open ? menu : undefined)}
        >

            <Dialog.Portal container={overlayContainer}>
                <Dialog.Overlay
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        position: 'fixed',
                        inset: 0,
                        //zIndex: 999,
                    }}
                />
            </Dialog.Portal>

            <Dialog.Content
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor:'var(--background)',
                    padding: '1.5rem',
                    borderLeft: '1px solid var(--secondary)',
                }}
            >
                {children}
            </Dialog.Content>
        </Dialog.Root>
    )
}