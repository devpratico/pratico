'use client'
import Canvas from "../Canvas/Canvas";
import useBroadcastStore from "@/hooks_i/useBroadcastStore";
import { useCapsule } from "@/hooks_i/capsuleContext";
import { TLStoreSnapshot } from "@tldraw/tldraw";
import  AutoSaver from "../AutoSaver/AutoSaver";
import { useRoom } from "@/hooks_i/roomContext";


interface CanvasRTProps {
    children: React.ReactNode;
    //roomName: string;
}

/**
 * This is a special kind of canvas that allows for real time collaboration.
 * `RT` stands for "real time".
 */
export default function CanvasRT({children}: CanvasRTProps) {

    /*
    // Get the capsule we're in
    const { capsule } = useCapsule()

    let initialSnapshot;
    if (capsule.tld_snapshot) {
        initialSnapshot = JSON.parse(capsule.tld_snapshot as any) as TLStoreSnapshot
    }
    */

    // Get the room we're in
    const { room } = useRoom()
    const roomName = room?.name
    const roomId = room?.id
    if (!room || !roomName || !roomId) {
        throw new Error(`Missing Room data: {room: ${room}, roomName: ${roomName}, roomId: ${roomId}}`)
    }
    const initialSnapshot = room.capsule_snapshot ? JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot : undefined


    const store = useBroadcastStore({roomName, initialSnapshot})

    return (
        <Canvas store={store}>
            {children}
            <AutoSaver destination='room' id={roomId} />
        </Canvas>
    )
}