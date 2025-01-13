'use client'
import { useCardDialog } from "@/app/(frontend)/_hooks/contexts/useCardDialog"
import CardDialog from "./CardDialog"


/**
 * Card dialog that is shared through the layout
 */
export default function GlobalCardDialog() {
    const { open, setOpen, preventClose, content } = useCardDialog()

    return (
        <CardDialog open={open} onOpenChange={setOpen} preventClose={preventClose}>
            {content}
        </CardDialog>
    )
}