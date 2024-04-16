'use client'
import CanvasRT from "../CanvasRT/CanvasRT";
import CanvasSL from "../CanvasSL/CanvasSL";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import { useMemo } from "react";


/**
 * This client component switches between the real time canvas and the solo canvas.
 * depending on if there is a room or not.
 */
export default function Desk() {
    const { room } = useRoom()
    const haveRoom = useMemo(() => !!room, [room])
    return haveRoom ? <CanvasRT/> : <CanvasSL/>
}