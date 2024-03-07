'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
//import { setCapsuleSnapshot } from "@/supabase/services/capsules";
import { useEditor } from "@tldraw/tldraw";
import logger from "@/utils/logger";
import { useRouter } from "next/navigation";
import { useCapsule } from '@/hooks/capsuleContext';
import { saveCapsuleSnapshot } from "@/actions/capsuleActions";
import { useRoom } from "@/hooks/roomContext";


interface DoneBtnProps {
    message?: string;
}

/**
 * This component is a button that saves the current tldraw snapshot to supabase
 * and navigates back to the dashboard.
 */
export default function DoneBtn({ message }: DoneBtnProps) {

    const router = useRouter()
    const { capsule } = useCapsule()
    const capsuleId = capsule?.id

    const { setRoom } = useRoom()

    // TODO: Maybe get rid of tldraw stuff and use a hook
    const editor = useEditor()
    const handleClick = async () => {
        logger.log('react:component', 'Clicked save button', { capsuleId })
        const snapshot = editor.store.getSnapshot()
        try {
            await saveCapsuleSnapshot(capsuleId!, snapshot)
            // TODO: Maybe keep the room open ?
            setRoom(undefined) // This will stop the session (if it's running)
            router.push('/capsules')
            router.refresh() // This is to force the revalidation of the cache
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
            message={message || "Done"}
        />
    )
}