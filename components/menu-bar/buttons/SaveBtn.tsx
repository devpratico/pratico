'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { setCapsuleSnapshot } from "@/supabase/services/capsules";
import { useEditor } from "@tldraw/tldraw";
import logger from "@/utils/logger";


interface SaveBtnProps {
    capsuleId?: string;
}

/**
 * This component is a button that saves the current tldraw snapshot to supabase.
 */
export default function SaveBtn({ capsuleId }: SaveBtnProps) {

    const editor = useEditor()
    const handleClick = async () => {
        logger.log('react:component', 'Clicked save button', { capsuleId })
        const snapshot = editor.store.getSnapshot()
        try {
            await setCapsuleSnapshot(capsuleId!, snapshot)
            logger.log('react:component', 'Save button callback ended', { capsuleId, snapshot })

        } catch (error) {
            console.error("Error saving snapshot", error)
        }
    }

    return (
        <PlainBtn
            color="secondary"
            style="soft"
            enabled={!!capsuleId}
            onClick={handleClick}
        >
            Save
        </PlainBtn>
    )
}