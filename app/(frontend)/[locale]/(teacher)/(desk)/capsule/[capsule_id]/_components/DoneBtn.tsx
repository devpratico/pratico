'use client'
import logger from "@/app/_utils/logger";
import { useRouter } from "next/navigation";
import { saveCapsuleSnapshot } from "@/app/(backend)/api/capsule/capsule.client";
import { useTLEditor } from "@/app/(frontend)/_hooks/useTLEditor";
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@radix-ui/themes";
//import { useSnapshot } from "@/app/_hooks/useSnapshot";


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
    //const { snapshot } = useSnapshot()
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const [loading, setLoading] = useState(false)


    const handleClick = useCallback(async () => {
        logger.log('react:component', 'Clicked save button', { capsuleId })
        setLoading(true)

        const snapshot = editor?.getSnapshot()

        if (!capsuleId || !editor || !snapshot) {
            logger.warn('react:component', 'No capsuleId or editor or snapshot to save.')
            router.push('/capsules')
            return
        }
    
        await saveCapsuleSnapshot(capsuleId!, snapshot)
        router.push('/capsules')
        router.refresh()

      
    }, [capsuleId, editor, router])

    return (
        <Button
            variant="soft"
            onClick={handleClick}
            loading={loading}
            style={{ color: 'var(--background)', backgroundColor: 'hsla(var(--background-h), var(--background-s), var(--background-l), 0.2)' }}
        >
            {message}
        </Button>
    )
}