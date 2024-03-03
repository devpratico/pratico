'use client'
import CanvasRT from "../CanvasRT/CanvasRT";
import CanvasSL from "../CanvasSL/CanvasSL";
import Canvas from "../Canvas/Canvas";
import { useRoom } from "@/hooks/roomContext";


/**
 * This is the Canvas but server side, allowing for custom UI
 * with internationalization and other server side features.
 */
export default function Desk({children}: {children: React.ReactNode}) {

    const { room } = useRoom()
    const roomName = room?.name

    if (roomName) {
        // If we have a room, we use the real time canvas
        return (
            <CanvasRT roomName={roomName}>
                {children}
            </CanvasRT>
        )
    } else {
        // Else we use the solo canvas
        return (
            <CanvasSL>
                {children}
            </CanvasSL>
        )
    }
}