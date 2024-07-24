'use client'
import { useMenus } from '@/app/_hooks/useMenus'
import type { DeskMenu } from '@/app/_hooks/useMenus'
import * as Dialog from '@radix-ui/react-dialog';


interface DeskMenuLayoutProps {
    menu: DeskMenu;
    children: React.ReactNode;
}

export default function DeskMenuLayout({ menu, children }: DeskMenuLayoutProps) {
    const { openedDeskMenu, setOpenDeskMenu } = useMenus()

    return (
        <Dialog.Root
            open={openedDeskMenu === menu}
            onOpenChange={open => setOpenDeskMenu(open ? menu : undefined)}
        >

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