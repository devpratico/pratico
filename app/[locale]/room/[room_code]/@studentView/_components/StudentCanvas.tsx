'use client'
import Canvas from "@/app/[locale]/_components/canvases/Canvas";
import useBroadcastStore from "@/app/[locale]/_hooks/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import TLToolbar from "@/app/[locale]/_components/canvases/custom-ui/tool-bar/TLToolbar";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import AutoSaver from "@/app/[locale]/_components/canvases/custom-ui/AutoSaver/AutoSaver";
import NavigatorSync from "@/app/[locale]/_components/canvases/custom-ui/NavigatorSync/NavigatorSync";
import { useMemo } from "react";
import Resizer from "@/app/[locale]/_components/canvases/custom-ui/Resizer/Resizer";
import logger from "@/app/_utils/logger";


export default function StudentCanvas() {

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
        <Canvas store={store}>
            <div style={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', left: '10px', zIndex: 1000 }}>
                <TLToolbar />
            </div>
            <Resizer insets={{ top: 0, right: 0, bottom: 0, left: 70 }} margin={10} />
            <AutoSaver saveTo={{ destination: 'remote room', roomId: room.id }} />
            <NavigatorSync />
        </Canvas>
    )
}