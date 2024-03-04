'use client'
import Canvas from "../Canvas/Canvas";
import useBroadcastStore from "@/hooks_i/useBroadcastStore";
import { TLStoreSnapshot } from "@tldraw/tldraw";
import { useRoom } from "@/hooks_i/roomContext";
import AutoSaver from "../AutoSaver/AutoSaver";


interface CanvasSTProps {
    children?: React.ReactNode;
    roomName: string;
}

/**
 * This is a canvas for the room page. It allows for real time collaboration.
 * `ST` stands for "student".
 */
export default function CanvasST({children, roomName}: CanvasSTProps) {

    // Get the room we're in
    const { room } = useRoom()
    const roomId = room?.id
    if (!room || !roomId) {
        throw new Error(`Missing Room data: {room: ${room}, roomId: ${roomId}}`)
    }

    let initialSnapshot;
    if (room?.capsule_snapshot) {
        initialSnapshot = JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot
    }

    const store = useBroadcastStore({roomName, initialSnapshot})

    return (
        <Canvas store={store}>
            {children}
            <AutoSaver destination='room' id={roomId} />
        </Canvas>
    )
}