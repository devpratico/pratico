'use client'
import Canvas from "./Canvas";
import useBroadcastStore from "@/app/[locale]/_hooks/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import  AutoSaver from "./custom-ui/AutoSaver/AutoSaver";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import { useMemo } from "react";
import Resizer from "./custom-ui/Resizer/Resizer";


interface CanvasRTProps {
    children?: React.ReactNode;
}

/**
 * This is a special kind of canvas that allows for real time collaboration.
 * `RT` stands for "real time".
 */
export default function CanvasRT({children}: CanvasRTProps) {

    // Get the room we're in
    const { room } = useRoom()

    // Compute some values
    const roomId = useMemo(() => room?.id?.toString(), [room])
    const initialSnapshot = useMemo(() => room?.capsule_snapshot ? JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot : undefined, [room])
    
    // Create a store for the canvas
    const store = useBroadcastStore({roomId, initialSnapshot})

    // TODO: clean up that number or string roomId
    if (!room || !room.id || !roomId) {
        return <div>{`Missing Room data: {room: ${room}, roomId: ${roomId}, roomId: ${roomId}}`}</div>
    }

    return (
        <Canvas store={store}>
            {children}
            <Resizer insets={{ top: 60, right: 0, bottom: 70, left: 60 }} margin={10} />
            <AutoSaver saveTo={{destination: 'remote room', roomId: room.id}}/>
        </Canvas>
    )
}