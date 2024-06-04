'use client'
import styles from './DeskMenuLayout.module.css'
import { useMenus } from '@/app/[locale]/_hooks/useMenus'
import { Dialog, DialogContent } from '@/app/[locale]/_components/primitives/Dialog/Dialog'
import type { DeskMenu } from '@/app/[locale]/_hooks/useMenus'


interface DeskMenuLayoutProps {
    menu: DeskMenu;
    children: React.ReactNode;
}

export default function DeskMenuLayout({ menu, children }: DeskMenuLayoutProps) {
    const { openedDeskMenu, setOpenDeskMenu } = useMenus()

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