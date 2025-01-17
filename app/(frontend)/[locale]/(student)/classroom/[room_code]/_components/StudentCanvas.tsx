'use client'
import Canvas from "@/app/(frontend)/[locale]/_components/canvases/Canvas";
import useBroadcastStore from "@/app/(frontend)/_hooks/standalone/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import AutoSaver from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/AutoSaver";
import NavigatorSync from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/NavigatorSync";
import Resizer from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";
import { CanvasUser } from "@/app/(frontend)/[locale]/_components/canvases/Canvas";
import { useRoom } from "@/app/(frontend)/_hooks/contexts/useRoom";
import { useEffect } from "react";
import { useTLEditor } from "@/app/(frontend)/_hooks/contexts/useTLEditor";
import { setUserPreferences } from "tldraw";
import logger from "@/app/_utils/logger";
import {Flex } from "@radix-ui/themes";


interface StudentCanvasProps {
    user: CanvasUser
    snapshot?: TLStoreSnapshot
}


// TODO: Put the toolbar in the page or a layout
export default function StudentCanvas({ user, snapshot }: StudentCanvasProps) {
    const { room } = useRoom()
    const canCollab = room?.params?.collaboration?.active && ( room?.params?.collaboration?.allowAll || room?.params?.collaboration?.allowedUsersIds.includes(user.id))

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
        logger.log('react:component', 'StudentCanvas', 'canCollab changed:', canCollab)
        editor?.updateInstanceState({ isReadonly: !canCollab })
    }, [canCollab, editor])

    return (
        <>
            <Flex gridRow={{ initial: '2', xs: '1' }} align='center' />
            <Canvas store={store}>
                <Resizer />
                <NavigatorSync />
                { room?.id && <AutoSaver saveTo={{ destination: 'remote room', roomId: room.id }} /> }
            </Canvas>
        </>
    )
}