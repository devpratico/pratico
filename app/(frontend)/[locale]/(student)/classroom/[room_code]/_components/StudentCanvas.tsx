'use client'
import Canvas from "@/app/(frontend)/[locale]/_components/canvases/Canvas";
import useBroadcastStore from "@/app/(frontend)/_hooks/standalone/useBroadcastStore";
import { TLStoreSnapshot } from "tldraw";
import AutoSaver from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/AutoSaver";
import NavigatorSync from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/NavigatorSync";
import Resizer from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";
import { CanvasUser } from "@/app/(frontend)/[locale]/_components/canvases/Canvas";
import { useRoom } from "@/app/(frontend)/_hooks/contexts/useRoom";
import { useEffect, useMemo } from "react";
import { useTLEditor } from "@/app/(frontend)/_hooks/contexts/useTLEditor";
import { setUserPreferences } from "tldraw";
import logger from "@/app/_utils/logger";
import { CustomTlToolbar } from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/tool-bar/ToolBar";
import useWindow from "@/app/(frontend)/_hooks/contexts/useWindow";
import { useRealtimeActivityContext } from "@/app/(frontend)/_hooks/contexts/useRealtimeActivityContext";


interface StudentCanvasProps {
    user: CanvasUser
    snapshot?: TLStoreSnapshot
}


// TODO: Put the toolbar in the page or a layout
export default function StudentCanvas({ user, snapshot }: StudentCanvasProps) {
    const { widerThan, narrowerThan } = useWindow()
    const { room } = useRoom()
    const canCollab = room?.params?.collaboration?.active && ( room?.params?.collaboration?.allowAll || room?.params?.collaboration?.allowedUsersIds.includes(user.id))

    const { snapshot: activitySnapshot } = useRealtimeActivityContext()

    // TODO: Fix this dirty fix
    const shouldHideCanvas = useMemo(() => {
        const isMobile = narrowerThan("sm")
        const ongoingActivity = !!activitySnapshot
        return isMobile && ongoingActivity
    }, [narrowerThan, activitySnapshot])

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

    if (shouldHideCanvas) return <div>Canvas</div>

    return (
        <Canvas store={store}>
            { canCollab ? <CustomTlToolbar /> : null }
            <Resizer insets={{ top: 0, bottom: 0, right: 0, left: canCollab && widerThan("xs") ? 80 : 0}} />
            <NavigatorSync />
            { room?.id && <AutoSaver saveTo={{ destination: 'remote room', roomId: room.id }} /> }
        </Canvas>
    )
}