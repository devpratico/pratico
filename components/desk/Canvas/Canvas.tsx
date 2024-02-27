'use client'
import {
    Tldraw,
    Editor, 
    setUserPreferences, 
    DefaultColorStyle, 
    DefaultSizeStyle,
    TLStoreWithStatus,
    TLStore,
    StoreSnapshot,
    TLRecord
} from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import Background from '../custom-ui/Background/Background'
import CanvasArea from '../custom-ui/CanvasArea/CanvasArea'
//import useBroadcastStore from '@/hooks/useBroadcastStore'



/**
 * This function is called when the tldraw editor is mounted.
 * It's used to set some initial preferences.
 */
const handleMount = (editor: Editor) => {
    setUserPreferences({ id: 'tldraw', edgeScrollSpeed: 0 })
    editor.updateInstanceState({ canMoveCamera: false })
    editor.setStyleForNextShapes(DefaultColorStyle, "black");
    editor.setStyleForNextShapes(DefaultSizeStyle , "m");
}


export interface CanvasProps {
    store?: TLStoreWithStatus | TLStore
    initialSnapshot?: StoreSnapshot<TLRecord>
    children?: React.ReactNode
}

/**
 * This is the canvas component provided by tldraw.
 * It is a client component. We use [Dask](../Desk/Desk.tsx) to load server components inside (like the toolbar).
 */
export default function Canvas({store, initialSnapshot, children}: CanvasProps) {
    //const bstore = useBroadcastStore()
    return (
        <Tldraw
            hideUi={true}
            onMount={handleMount}
            components={{Background: Background, OnTheCanvas: CanvasArea}}
            store={store}
            snapshot={initialSnapshot}
        >
            {children}
        </Tldraw>
    )
}