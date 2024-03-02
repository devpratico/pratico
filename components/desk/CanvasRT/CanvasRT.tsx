'use client'
import Canvas from "../Canvas/Canvas";
import useBroadcastStore from "@/hooks/useBroadcastStore";
import { useCapsule } from "@/hooks/capsuleContext";
import { useRoom } from "@/hooks/roomContext";
import { TLStoreSnapshot, TLStore, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";


/**
 * This is a special kind of canvas that allows for real time collaboration.
 */
export default function CanvasRT({children}: {children: React.ReactNode}) {

    // Get the capsule we're in that has been fetched from Supabase by a parent component
    const { capsule } = useCapsule()
    let initialSnapshot: TLStoreSnapshot | undefined
    if (capsule.tld_snapshot) {
        initialSnapshot = JSON.parse(capsule.tld_snapshot as any) as TLStoreSnapshot
    }

    // Get the room that exists for this capsule (if any)
    const { room } = useRoom()

    let store: TLStore
    if (room && room.name) {
        // If there is a room, we use a special kind of store that allows for real time collaboration
        store = useBroadcastStore({roomId: room.name, initialSnapshot})
    } else {
        // If there is no room, we initialize a regular store
        store = createTLStore({shapeUtils: defaultShapeUtils})
        if (initialSnapshot) store.loadSnapshot(initialSnapshot)
    }

    return (
        <Canvas store={store}>
            {children}
        </Canvas>
    )
}