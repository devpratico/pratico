'use client'
import Canvas from "../Canvas/Canvas";
import useBroadcastStore from "@/app/_hooks/useBroadcastStore";
import { TLStoreSnapshot, getUserPreferences } from "tldraw";
import { useRoom } from "@/app/_hooks/useRoom";
import AutoSaver from "../custom-ui/AutoSaver/AutoSaver";
import { useRouter } from "next/navigation";
import NavigatorSync from "../custom-ui/NavigatorSync/NavigatorSync";
import { useEffect, useMemo } from "react";
import logger from "@/app/_utils/logger";


interface CanvasSTProps {
    children?: React.ReactNode;
}

/**
 * This is a canvas for the room page. It allows for real time collaboration.
 * `ST` stands for "student".
 * @client
 */
export default function CanvasST({children}: CanvasSTProps) {
    const router = useRouter()

    // Get the room we're in
    const { room } = useRoom()
    const roomId = useMemo(() => room?.id?.toString(), [room])

    

    let initialSnapshot;
    if (room?.capsule_snapshot) {
        initialSnapshot = JSON.parse(room.capsule_snapshot as any) as TLStoreSnapshot
    }

    // If there is no student name, redirect to the student form
    const userPref = getUserPreferences()
    useEffect(() => {
        if (!userPref.name && room?.code) {
            router.push(`/${room.code}/student-form`)
        }
    }, [userPref.name, router, room?.code])
    
    const store = useBroadcastStore({roomId, initialSnapshot})



    if (!room || !room.id || !roomId || !room.code) {
        //throw new Error(`Missing Room data: {room: ${room}, roomId: ${roomId}}`)
        logger.error('react:hook', `Missing Room data: {room: ${room}, roomId: ${roomId}}`)
        return <div>{`Missing Room data: {room: ${room}, roomId: ${roomId}}`}</div>
    }

    return (
        <Canvas store={store}>
            {children}
            <AutoSaver saveTo={{destination: 'remote room', roomId: room.id}}/>
            <NavigatorSync />
        </Canvas>
    )
}