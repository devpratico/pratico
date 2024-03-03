'use client'
import Canvas from "../Canvas/Canvas";
import { useCapsule } from "@/hooks/capsuleContext";
import { TLStoreSnapshot,  createTLStore, defaultShapeUtils, useEditor } from "@tldraw/tldraw";
import { saveCapsuleSnapshot } from "@/actions/capsuleActions";
import logger from "@/utils/logger";


interface CanvasSLProps {
    children: React.ReactNode;
}

/**
 * This is a solo canvas (no real time collaboration).
 */
export default function CanvasSL({children}: CanvasSLProps) {

    console.log('RENDERING CanvasSL')

    // Get the capsule we're in
    const { capsule } = useCapsule()
    const capsuleId = capsule?.id

    // Get the initial snapshot from the capsule
    let initialSnapshot: TLStoreSnapshot | undefined
    if (capsule.tld_snapshot) {
        initialSnapshot = JSON.parse(capsule.tld_snapshot as any) as TLStoreSnapshot
    }

    // Create the store
    const store = createTLStore({shapeUtils: defaultShapeUtils})
    if (initialSnapshot) store.loadSnapshot(initialSnapshot)
    
    return (
        <Canvas store={store}>
            <AutoSaver capsuleId={capsuleId} />
            {children}
        </Canvas>
    )
}


/**
 * This automaticaly saves the current snapshot to supabase every time it changes.
 */
function AutoSaver({ capsuleId }: { capsuleId?: string }) {

    const editor = useEditor()
    
    const save = async () => {
        const snapshot = editor.store.getSnapshot()
        if (capsuleId) {
            try {
                await saveCapsuleSnapshot(capsuleId, snapshot)
                logger.log('supabase:database', 'Snapshot saved', capsuleId)
            } catch (error) {
                logger.error('supabase:database', 'Error saving snapshot', (error as Error).message)
            }
        } else {
            logger.error('supabase:database', 'Error saving snapshot', 'No capsuleId')
        }
    }

    let timeout: NodeJS.Timeout
    const debouncedSave = () => {
        clearTimeout(timeout)
        timeout = setTimeout(save, 1000)
    }

    editor.store.listen(({changes}) => {
        debouncedSave()
    }, {source: 'user', scope: 'document'})

    return null
}