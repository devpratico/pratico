'use client'
import usePresence from "@/hooks/usePresence"
import { useUi } from "@/hooks/uiContext"
import { Dialog, DialogContent } from '@/components/primitives/Dialog/Dialog'


export default function Participants() {
    const presences = usePresence()
    const { openDeskMenu, setOpenDeskMenu } = useUi()

    const ParticipantsList = () => {
        return(
            <div>
                {presences.map(p => 
                    <div key={p.id}>
                        {`${p.userName} - ${p.color} - ${p.id}`}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Dialog open={openDeskMenu === 'participants'} onOpenChange={open => setOpenDeskMenu(open ? 'participants' : undefined)}>
            <DialogContent>
                <ParticipantsList />
            </DialogContent>
        </Dialog>
    )
}