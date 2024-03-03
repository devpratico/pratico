'use client'
import CanvasRT from "../CanvasRT/CanvasRT";
import CanvasSL from "../CanvasSL/CanvasSL";
import { useRoom } from "@/hooks/roomContext";


/**
 * This is the Canvas but server side, allowing for custom UI
 * with internationalization and other server side features.
 */
export default function Desk({children}: {children: React.ReactNode}) {
    const { room } = useRoom()

    if (room) {
        // If we have a room, we use the real time canvas
        return (
            <CanvasRT>
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