'use client'
import styles from './Participants.module.css'
import { useUi } from "@/hooks/uiContext"
import { Dialog, DialogContent } from '@/components/primitives/Dialog/Dialog'
import ParticipantsList from '../ParticipantsList/ParticipantsList'
import NavigationOption from '../NavigationOption/NavigationOption'


export default function Participants() {
    const { openDeskMenu, setOpenDeskMenu } = useUi()

    

    return (
        <Dialog
            open={openDeskMenu === 'participants'}
            onOpenChange={open => setOpenDeskMenu(open ? 'participants' : undefined)}
        >
            <DialogContent portal={false}>
                <div className={styles.container}>
                    <div>
                        <h2>Défilement</h2>
                        <NavigationOption />
                    </div>
                    <div>
                        <h2>Participants</h2>
                        <ParticipantsList />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}