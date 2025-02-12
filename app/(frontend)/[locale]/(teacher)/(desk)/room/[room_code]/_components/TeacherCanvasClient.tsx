'use client'
import Canvas from "@/app/(frontend)/[locale]/_components/canvases/Canvas";
import useBroadcastStore from "@/app/(frontend)/_hooks/standalone/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import AutoSaver from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/AutoSaver";
import NavigatorSync from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/NavigatorSync";
import Resizer from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";
import { CanvasUser } from "@/app/(frontend)/[locale]/_components/canvases/Canvas";
import { useEffect } from "react";
import { setUserPreferences } from "tldraw";
import { CustomTlToolbar } from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/tool-bar/ToolBar";
import useWindow from "@/app/(frontend)/_hooks/contexts/useWindow";


interface TeacherCanvasClientProps {
    user: CanvasUser
    roomId: number
    snapshot?: TLStoreSnapshot
}


export default function TeacherCanvasClient({ user, roomId, snapshot }: TeacherCanvasClientProps) {
    const store = useBroadcastStore({ roomId: roomId.toString(), initialSnapshot: snapshot })
    const { widerThan } = useWindow();

    useEffect(() => {
        setUserPreferences({
            id: user.id,
            name: user.name,
            color: user.color
        })
    }, [user])

    return (
        <Canvas store={store}>
            <CustomTlToolbar />
            <Resizer insets={{ top: 0, right: 0, bottom: 0, left: widerThan("xs") ? 80 : 0 }} margin={0} />
            <AutoSaver saveTo={{ destination: 'remote room', roomId: roomId }} saveOnMount/>
            <NavigatorSync />
        </Canvas>
    )
}