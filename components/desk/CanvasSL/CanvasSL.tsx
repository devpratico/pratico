'use client'
import Canvas from "../Canvas/Canvas";
import { TLStoreSnapshot,  createTLStore, defaultShapeUtils } from "tldraw";
import AutoSaver from "../custom-ui/AutoSaver/AutoSaver";
import { useParams } from "next/navigation";
import { fetchCapsuleSnapshot } from "@/supabase/services/capsules";
import { useEffect, useState } from "react";


export const dynamic = 'force-dynamic'

interface CanvasSLProps {
    children?: React.ReactNode;
}

/**
 * This is a solo canvas (no real time collaboration).
 * `SL` stands for "solo".
 */
export default function CanvasSL({children}: CanvasSLProps) {
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()

    // Get the initial snapshot from the capsule
    const [initialSnapshot, setInitialSnapshot] = useState<TLStoreSnapshot | undefined>(undefined)
    useEffect(() => {
        async function fetchSnapshot() {
            if (capsuleId) {
                //initialSnapshot = await fetchCapsuleSnapshot(capsuleId)
                const snapshot = await fetchCapsuleSnapshot(capsuleId)
                setInitialSnapshot(snapshot)
            }
        }
        fetchSnapshot()
    }, [capsuleId])


    // Create the store
    const [store, setStore] = useState(createTLStore({shapeUtils: defaultShapeUtils}))
    useEffect(() => {
        if (initialSnapshot) {
            const _store = createTLStore({shapeUtils: defaultShapeUtils})
            _store.loadSnapshot(initialSnapshot)
            setStore(_store)
        }
    }, [initialSnapshot])
    
    return (
        <Canvas store={store}>
            <AutoSaver destination='capsule' id={capsuleId} />
            {children}
        </Canvas>
    )
}


