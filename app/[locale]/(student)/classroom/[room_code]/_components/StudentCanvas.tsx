'use client'
import Canvas from "@/app/[locale]/_components/canvases/Canvas";
import useBroadcastStore from "@/app/_hooks/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import TLToolbar from "@/app/[locale]/_components/canvases/custom-ui/tool-bar/TLToolbar";
import AutoSaver from "@/app/[locale]/_components/canvases/custom-ui/AutoSaver/AutoSaver";
import NavigatorSync from "@/app/[locale]/_components/canvases/custom-ui/NavigatorSync/NavigatorSync";
import Resizer from "@/app/[locale]/_components/canvases/custom-ui/Resizer/Resizer";
import { CanvasUser } from "@/app/[locale]/_components/canvases/Canvas";
import { useRoom } from "@/app/_hooks/useRoom";
import { useState, useEffect } from "react";
import { useTLEditor } from "@/app/_hooks/useTLEditor";
import { setUserPreferences } from "tldraw";


interface StudentCanvasProps {
    user: CanvasUser
    snapshot?: TLStoreSnapshot
}


export default function StudentCanvas({ user, snapshot }: StudentCanvasProps) {
    const { room } = useRoom()
    const canCollab = room?.params?.collaboration?.active && ( room?.params?.collaboration?.allowAll || room?.params?.collaboration?.allowedUsersIds.includes(user.id))

    // TODO: remove the server side fetch and use a server action
    useEffect(() => {
        setUserPreferences({
            id: user.id,
            name: user.name,
            color: user.color
        })
    }, [user])


    const store = useBroadcastStore({ roomId:  room?.id.toString(), initialSnapshot: snapshot, broadcastPresence: canCollab })


    // Set canvas to read only if user is not allowed to collab
    const { editor } = useTLEditor()
    useEffect(() => {
        editor?.updateInstanceState({ isReadonly: !canCollab })
    }, [canCollab, editor])

    return (
        <Canvas
            //user={user}
            store={store}
        >
            {canCollab && <ToolBar />}
            <Resizer insets={{ top: 0, right: 0, bottom: 0, left: canCollab ? 60 : 0 }} margin={10} />
            { room?.id && <AutoSaver saveTo={{ destination: 'remote room', roomId: room.id }} /> }
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