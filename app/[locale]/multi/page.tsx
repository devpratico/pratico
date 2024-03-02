'use client'
import { Tldraw } from "@tldraw/tldraw"
import '@tldraw/tldraw/tldraw.css'
import useBroadcastStore from "@/hooks/useBroadcastStore"

export default function multiPage() {

    const store = useBroadcastStore({roomId: 'test-room'})
    return (
        <div style={{height: '100dvh'}}>
            <Tldraw store={store} />
        </div>
    )
}