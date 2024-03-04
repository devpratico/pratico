'use client'
import Canvas from "../Canvas/Canvas";
import useBroadcastStore from "@/hooks/useBroadcastStore";
import { TLStoreSnapshot } from "@tldraw/tldraw";
import  AutoSaver from "../AutoSaver/AutoSaver";
import { useRoom } from "@/hooks/roomContext";


interface CanvasRTProps {
    children: React.ReactNode;
    //roomName: string;
}

/**
 * This is a special kind of canvas that allows for real time collaboration.
 * `RT` stands for "real time".
 */
export default function CanvasRT({children}: CanvasRTProps) {

    // Get the room we're in
    const { room } = useRoom()
    const roomName = room?.name || undefined
    const initialSnapshot = room?.capsule_snapshot ? JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot : undefined
    const store = useBroadcastStore({roomName, initialSnapshot})

    const roomId = room?.id
    if (!room || !roomName || !roomId) {
        return <div>{`Missing Room data: {room: ${room}, roomName: ${roomName}, roomId: ${roomId}}`}</div>
    }

    return (
        <Canvas store={store}>
            {children}
            <AutoSaver destination='room' id={roomId} />
        </Canvas>
    )
}