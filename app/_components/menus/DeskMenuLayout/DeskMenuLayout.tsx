'use client'
import styles from './DeskMenuLayout.module.css'
import { useUi } from '@/app/_hooks/useUi'
import { Dialog, DialogContent } from '@/app/_components/primitives/Dialog/Dialog'
import type { DeskMenu } from '@/app/_hooks/useUi'


interface DeskMenuLayoutProps {
    menu: DeskMenu;
    children: React.ReactNode;
}

export default function DeskMenuLayout({ menu, children }: DeskMenuLayoutProps) {
    const { openedDeskMenu, setOpenDeskMenu } = useUi()

    return (
        <Dialog
            open={openedDeskMenu === menu}
            onOpenChange={open => setOpenDeskMenu(open ? 'participants' : undefined)}
        >
            <DialogContent portal={false} className={styles.container}>
                {children}
            </DialogContent>
        </Dialog>
    )
}