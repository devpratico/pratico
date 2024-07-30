'use client'
import Canvas from "@/app/[locale]/_components/canvases/Canvas";
import useBroadcastStore from "@/app/_hooks/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import AutoSaver from "@/app/[locale]/_components/canvases/custom-ui/AutoSaver";
import NavigatorSync from "@/app/[locale]/_components/canvases/custom-ui/NavigatorSync";
import Resizer from "@/app/[locale]/_components/canvases/custom-ui/Resizer";
import { CanvasUser } from "@/app/[locale]/_components/canvases/Canvas";
import { useEffect } from "react";
import { setUserPreferences } from "tldraw";


interface TeacherCanvasClientProps {
    user: CanvasUser
    roomId: number
    snapshot?: TLStoreSnapshot
}


export default function TeacherCanvasClient({ user, roomId, snapshot }: TeacherCanvasClientProps) {
    const store = useBroadcastStore({ roomId: roomId.toString(), initialSnapshot: snapshot })

    useEffect(() => {
        setUserPreferences({
            id: user.id,
            name: user.name,
            color: user.color
        })
    }, [user])

    return (
        <Canvas store={store}>
            <Resizer insets={{ top: 0, right: 0, bottom: 0, left: 0 }} margin={0} />
            <AutoSaver saveTo={{ destination: 'remote room', roomId: roomId }} />
            <NavigatorSync />
        </Canvas>
    )
}