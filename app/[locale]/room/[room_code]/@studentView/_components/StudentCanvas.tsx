'use client'
import Canvas from "@/app/[locale]/_components/canvases/Canvas";
import useBroadcastStore from "@/app/[locale]/_hooks/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import TLToolbar from "@/app/[locale]/_components/canvases/custom-ui/tool-bar/TLToolbar";
import AutoSaver from "@/app/[locale]/_components/canvases/custom-ui/AutoSaver/AutoSaver";
import NavigatorSync from "@/app/[locale]/_components/canvases/custom-ui/NavigatorSync/NavigatorSync";
import Resizer from "@/app/[locale]/_components/canvases/custom-ui/Resizer/Resizer";
import { CanvasUser } from "@/app/[locale]/_components/canvases/Canvas";
import { useRoom } from "@/app/[locale]/_hooks/useRoom";
import { useEffect } from "react";
import { useTLEditor } from "@/app/[locale]/_hooks/useTLEditor";


interface StudentCanvasProps {
    user: CanvasUser
    roomId: number
    snapshot?: TLStoreSnapshot
}


export default function StudentCanvas({ user, roomId, snapshot }: StudentCanvasProps) {
    const store = useBroadcastStore({ roomId:  roomId.toString(), initialSnapshot: snapshot })
    const { room } = useRoom()

    const canCollab = room?.params?.collaboration?.active && ( room?.params?.collaboration?.allowAll || room?.params?.collaboration?.allowedUsersIds.includes(user.id))

    // Set canvas to read only if user is not allowed to collab
    const { editor } = useTLEditor()
    useEffect(() => {
        editor?.updateInstanceState({ isReadonly: !canCollab })
    }, [canCollab, editor])

    return (
        <Canvas
            user={user}
            store={store}
        >
            {canCollab && <ToolBar />}
            <Resizer insets={{ top: 0, right: 0, bottom: 0, left: 70 }} margin={10} />
            <AutoSaver saveTo={{ destination: 'remote room', roomId: roomId }} />
            <NavigatorSync />
        </Canvas>
    )
}



function ToolBar() {
    return (
        <div style={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', left: '10px', zIndex: 1000 }}>
            <TLToolbar />
        </div>
    )
}