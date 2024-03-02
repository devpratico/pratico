'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { setCapsuleSnapshot } from "@/supabase/services/capsules";
import { useEditor } from "@tldraw/tldraw";
import logger from "@/utils/logger";
import { useRouter } from "next/navigation";
import { useCapsule } from '@/hooks/capsuleContext';


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

    // TODO: Maybe get rid of tldraw stuff and use a hook
    const editor = useEditor()
    const handleClick = async () => {
        logger.log('react:component', 'Clicked save button', { capsuleId })
        const snapshot = editor.store.getSnapshot()
        try {
            await setCapsuleSnapshot(capsuleId!, snapshot)
            router.push('/capsules')
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
            {message || "Done"}
        </PlainBtn>
    )
}