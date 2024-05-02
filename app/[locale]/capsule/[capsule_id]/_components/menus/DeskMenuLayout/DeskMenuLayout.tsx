'use client'
import styles from './DeskMenuLayout.module.css'
import { useMenu } from '@/app/[locale]/_hooks/useMenu'
import { Dialog, DialogContent } from '@/app/[locale]/_components/primitives/Dialog/Dialog'
import type { DeskMenu } from '@/app/[locale]/_hooks/useMenu'


interface DeskMenuLayoutProps {
    menu: DeskMenu;
    children: React.ReactNode;
}

export default function DeskMenuLayout({ menu, children }: DeskMenuLayoutProps) {
    const { openedDeskMenu, setOpenDeskMenu } = useMenu()

    return (
        <Dialog
            open={openedDeskMenu === menu}
            onOpenChange={open => setOpenDeskMenu(open ? menu : undefined)}
        >
            <DialogContent portal={false} className={styles.container}>
                {children}
            </DialogContent>
        </Dialog>
    )
}