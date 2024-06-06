'use client'
import logger from "@/app/_utils/logger";
import { useRouter } from "next/navigation";
import { saveCapsuleSnapshot } from "@/app/[locale]/capsule/[capsule_id]/actions";
import { useTLEditor } from "@/app/[locale]/_hooks/useTLEditor";
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@radix-ui/themes";


interface DoneBtnProps {
    message?: string;
}

/**
 * This component is a button that saves the current tldraw snapshot to supabase
 * and navigates back to the dashboard.
 */
export default function DoneBtn({ message }: DoneBtnProps) {
    const router = useRouter()
    const { editor } = useTLEditor()
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const [loading, setLoading] = useState(false)
    

    const handleClick = useCallback(async () => {
        logger.log('react:component', 'Clicked save button', { capsuleId })
        setLoading(true)
        if (!capsuleId || !editor) return
        const snapshot = editor.store.getSnapshot()
        try {
            await saveCapsuleSnapshot(capsuleId!, snapshot)
            router.push('/capsules')
            router.refresh() // This is to force the revalidation of the cache

        } catch (error) {
            logger.error('react:component', 'Error saving snapshot', (error as Error).message)
            setLoading(false)
        }
    }, [capsuleId, editor, router])

    return (
        <Button
            variant="soft"
            onClick={handleClick}
            loading={loading}
            style={{color:'var(--background)', backgroundColor:'hsla(var(--background-h), var(--background-s), var(--background-l), 0.2)'}}
        >
            {message}
        </Button>
    )
}