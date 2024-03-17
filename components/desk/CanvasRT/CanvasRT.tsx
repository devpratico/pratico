'use client'
import Canvas from "../Canvas/Canvas";
import useBroadcastStore from "@/hooks/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import  AutoSaver from "../custom-ui/AutoSaver/AutoSaver";
import { useRoom } from "@/hooks/useRoom";
import { useMemo } from "react";


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

    if (!room || !roomId) {
        return <div>{`Missing Room data: {room: ${room}, roomId: ${roomId}, roomId: ${roomId}}`}</div>
    }

    return (
        <Canvas store={store}>
            {children}
            <AutoSaver destination='room' id={roomId} />
        </Canvas>
    )
}