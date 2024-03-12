'use client'
import Canvas from "../Canvas/Canvas";
import useBroadcastStore from "@/hooks/useBroadcastStore";
import { TLStoreSnapshot, getUserPreferences } from "@tldraw/tldraw";
import { useRoom } from "@/hooks/useRoom";
import AutoSaver from "../AutoSaver/AutoSaver";
import { useRouter } from "next/navigation";


interface CanvasSTProps {
    children?: React.ReactNode;
}

/**
 * This is a canvas for the room page. It allows for real time collaboration.
 * `ST` stands for "student".
 */
export default function CanvasST({children}: CanvasSTProps) {
    const router = useRouter()

    // Get the room we're in
    const { room } = useRoom()
    const roomId = room?.id?.toString()
    if (!room || !roomId) {
        throw new Error(`Missing Room data: {room: ${room}, roomId: ${roomId}}`)
    }

    // If there is no student name, redirect to the student form
    const userPref = getUserPreferences()
    if (!userPref.name) {
        router.push(`/${room.code}/student-form`)
    }

    let initialSnapshot;
    if (room?.capsule_snapshot) {
        initialSnapshot = JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot
    }

    const store = useBroadcastStore({roomId, initialSnapshot})

    return (
        <Canvas store={store}>
            {children}
            <AutoSaver destination='room' id={roomId} />
        </Canvas>
    )
}