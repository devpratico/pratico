'use client'
import Canvas from "../Canvas/Canvas";
import { TLStoreSnapshot,  createTLStore, defaultShapeUtils } from "tldraw";
import AutoSaver from "../custom-ui/AutoSaver/AutoSaver";
import { useParams, useSearchParams } from "next/navigation";
import { fetchCapsuleSnapshot } from "@/supabase/services/capsules";
import { useEffect, useState } from "react";
import useIsLocalDoc from "@/hooks/useIsLocalDoc";


/**
 * This is a solo canvas (no real time collaboration). `SL` stands for "solo".
 * It can either fetch the remote snapshot from database (if `local=false`)
 * or use the local storage (if `local=true`) for loginless users.
 */
export default function CanvasSL() {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const local = useIsLocalDoc()

    // Get the initial snapshot from the capsule
    const [initialSnapshot, setInitialSnapshot] = useState<TLStoreSnapshot | undefined>(undefined)
    useEffect(() => {
        async function fetchSnapshot() {
            if (capsuleId && !local) {
                const snapshot = await fetchCapsuleSnapshot(capsuleId)
                setInitialSnapshot(snapshot)
            }
        }
        fetchSnapshot()
    }, [capsuleId, local])


    // Create the store
    const [store, setStore] = useState(createTLStore({shapeUtils: defaultShapeUtils}))
    useEffect(() => {
        if (initialSnapshot) {
            const _store = createTLStore({shapeUtils: defaultShapeUtils})
            _store.loadSnapshot(initialSnapshot)
            setStore(_store)
        }
    }, [initialSnapshot])

    
    if (local) {
        // If local, we will use the local storage (see https://tldraw.dev/docs/persistence)
        return <Canvas persistenceKey={capsuleId}/>
        
    } else {
        // If not local, we will use the AutoSaver to save the snapshot to the capsule
        return (
            <Canvas store={store}>
                <AutoSaver saveTo={{ destination: 'remote capsule', capsuleId: capsuleId }} />
            </Canvas>
        )
    }
}


