'use client'
import Canvas from "../Canvas/Canvas";
import useBroadcastStore from "@/hooks/useBroadcastStore";
import { useCapsule } from "@/hooks/capsuleContext";
import { TLStoreSnapshot } from "@tldraw/tldraw";


interface CanvasRTProps {
    children: React.ReactNode;
    roomName: string;
}

/**
 * This is a special kind of canvas that allows for real time collaboration.
 */
export default function CanvasRT({children, roomName}: CanvasRTProps) {

    console.log('RENDERING CanvasRT')
    console.log('roomName', roomName)

    // Get the capsule we're in
    const { capsule } = useCapsule()

    let initialSnapshot;
    if (capsule.tld_snapshot) {
        initialSnapshot = JSON.parse(capsule.tld_snapshot as any) as TLStoreSnapshot
    }

    const store = useBroadcastStore({roomName, initialSnapshot})

    return (
        <Canvas store={store}>
            {children}
        </Canvas>
    )
}