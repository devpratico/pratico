'use client'
import styles from './page.module.css'
import CanvasRT from "@/components/desk/CanvasRT/CanvasRT";
import CanvasSL from "@/components/desk/CanvasSL/CanvasSL";
import { useRoom } from "@/hooks/useRoom";
import { useMemo } from "react";


// TODO: use intercepting routes to handle between a creation page and a room page?
export default async function CapsulePage() {

    const { room } = useRoom()
    const haveRoom = useMemo(() => !!room, [room])

    return (
        <main className={styles.main}>
            {haveRoom ? <CanvasRT/> : <CanvasSL/>}
        </main>
    )
}