'use client'
import Canvas from "../Canvas/Canvas";
import { useCapsule } from "@/hooks/useCapsule";
import { TLStoreSnapshot,  createTLStore, defaultShapeUtils } from "tldraw";
import AutoSaver from "../custom-ui/AutoSaver/AutoSaver";


interface CanvasSLProps {
    children?: React.ReactNode;
}

/**
 * This is a solo canvas (no real time collaboration).
 * `SL` stands for "solo".
 */
export default function CanvasSL({children}: CanvasSLProps) {
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
            <AutoSaver destination='capsule' id={capsuleId} />
            {children}
        </Canvas>
    )
}


