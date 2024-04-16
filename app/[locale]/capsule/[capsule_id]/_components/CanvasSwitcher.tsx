'use client'
import CanvasRT from "@/app/[locale]/_components/desk/CanvasRT/CanvasRT";
import CanvasSL from "@/app/[locale]/_components/desk/CanvasSL/CanvasSL";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import { useMemo } from "react";

// TODO: Maybe we'll fuse CanvasRT, CanvasSL and Canvas ST
/**
 * We need this in a client component because we need to use the `useRoom` hook,
 * and we want to keep the page as a server component to load the traductions.
 */
export default function CanvasSwitcher() {
    const { room } = useRoom()
    const haveRoom = useMemo(() => !!room, [room])
    return haveRoom ? <CanvasRT/> : <CanvasSL/>
}