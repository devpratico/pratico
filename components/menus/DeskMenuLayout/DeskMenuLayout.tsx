'use client'
import styles from './DeskMenuLayout.module.css'
import { useUi } from '@/hooks/uiContext'
import { Dialog, DialogContent } from '@/components/primitives/Dialog/Dialog'
import type { DeskMenu } from '@/hooks/uiContext'


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
            <DialogContent portal={false}>
                <div className={styles.container}>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}