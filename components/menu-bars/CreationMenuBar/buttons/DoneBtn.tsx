'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/utils/logger";
import { useRouter } from "next/navigation";
import { useCapsule } from '@/hooks/old_useCapsule';
import { saveCapsuleSnapshot } from "@/actions/capsuleActions";
import { useRoom } from "@/hooks/useRoom";
import { useTLEditor } from "@/hooks/useTLEditor";
import { useMemo, useCallback } from "react";
import { useParams } from "next/navigation";


interface DoneBtnProps {
    message?: string;
}

/**
 * This component is a button that saves the current tldraw snapshot to supabase
 * and navigates back to the dashboard.
 */
export default function DoneBtn({ message }: DoneBtnProps) {
    // TODO: Maybe get rid of tldraw stuff and use a hook

    const router = useRouter()
    //const { capsule } = useCapsule()
    const { setRoom } = useRoom()
    const { editor } = useTLEditor()
    //const capsuleId = useMemo(() => capsule?.id, [capsule])
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    

    const handleClick = useCallback(async () => {
        logger.log('react:component', 'Clicked save button', { capsuleId })
        if (!capsuleId || !editor) return
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
    }, [capsuleId, editor, router, setRoom])

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