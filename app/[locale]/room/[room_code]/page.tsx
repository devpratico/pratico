'use client'
import Canvas from "@/app/[locale]/_components/canvases/Canvas";
import useBroadcastStore from "@/app/[locale]/_hooks/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import AutoSaver from "@/app/[locale]/_components/canvases/custom-ui/AutoSaver/AutoSaver";
import NavigatorSync from "@/app/[locale]/_components/canvases/custom-ui/NavigatorSync/NavigatorSync";
import { useMemo } from "react";
import logger from "@/app/_utils/logger";


interface CanvasSTProps {
    children?: React.ReactNode;
}

/**
 * This is a canvas for the room page. It allows for real time collaboration.
 * `ST` stands for "student".
 * @client
 */
export default function RoomPage({ children }: CanvasSTProps) {
    // Get the room we're in
    const { room } = useRoom()
    const roomId = useMemo(() => room?.id?.toString(), [room])

    let initialSnapshot;
    if (room?.capsule_snapshot) {
        initialSnapshot = JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot
    }

    const store = useBroadcastStore({ roomId, initialSnapshot })

    if (!room || !room.id || !roomId || !room.code) {
        //throw new Error(`Missing Room data: {room: ${room}, roomId: ${roomId}}`)
        logger.error('react:hook', `Missing Room data: {room: ${room}, roomId: ${roomId}}`)
        return <div>{`Missing Room data: {room: ${room}, roomId: ${roomId}}`}</div>
    }

    return (
        <main style={{height: '100dvh'}}>
            <Canvas store={store}>
                {children}
                <AutoSaver saveTo={{ destination: 'remote room', roomId: room.id }} />
                <NavigatorSync />
            </Canvas>
        </main>
    )
}