'use client'
import PlainBtn from "@/app/[locale]/_components/primitives/buttons/PlainBtn/PlainBtn";
import logger from "@/app/_utils/logger";
import { useRouter } from "next/navigation";
import { saveCapsuleSnapshot } from "@/app/[locale]/capsule/[capsule_id]/_actions/capsuleActions";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import { useTLEditor } from "@/app/[locale]/_hooks/useTLEditor";
import { useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";


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
    const { setRoom } = useRoom()
    const { editor } = useTLEditor()
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const searchParams = useSearchParams()
    const local = searchParams.get('local') === 'true'
    

    const handleClick = useCallback(async () => {
        logger.log('react:component', 'Clicked save button', { capsuleId })
        if (!capsuleId || !editor) return
        const snapshot = editor.store.getSnapshot()
        try {
            if (!local) await saveCapsuleSnapshot(capsuleId!, snapshot)

            // TODO: Maybe keep the room open ?
            setRoom(undefined) // This will stop the session (if it's running)
            router.push('/capsules')
            router.refresh() // This is to force the revalidation of the cache

        } catch (error) {
            //console.error("Error saving snapshot", error)
            logger.error('react:component', 'Error saving snapshot', (error as Error).message)
        }
    }, [capsuleId, editor, router, setRoom, local])

    return (
        <PlainBtn
            color="secondary"
            style="soft"
            enabled={!local}
            onClick={handleClick}
            message={message || "Done"}
        />
    )
}