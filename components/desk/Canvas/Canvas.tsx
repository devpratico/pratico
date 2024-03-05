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
import { generateRandomCode, getRandomColor } from '@/utils/codeGen'



/**
 * This function is called when the tldraw editor is mounted.
 * It's used to set some initial preferences.
 */
const handleMount = (editor: Editor) => {
    // TODO: This uses LocalStorage. We should use data from the database.
    setUserPreferences({
        id: 'ID_' + generateRandomCode(),
        color: getRandomColor(),
        name: 'Tom D',
        edgeScrollSpeed: 0
    })
    editor.updateInstanceState({ canMoveCamera: false })
    editor.setStyleForNextShapes(DefaultColorStyle, "black");
    editor.setStyleForNextShapes(DefaultSizeStyle , "m");
}


export interface CanvasProps {
    store?: TLStoreWithStatus | TLStore
    /**
     * The initial snapshot of the store. Should not be used if the store is provided.
     */
    initialSnapshot?: StoreSnapshot<TLRecord>
    children?: React.ReactNode
}

/**
 * This is the canvas component provided by tldraw.
 * It is a client component. We use [Desk](../Desk/Desk.tsx) to load server components (i.e. the ToolBar) inside.
 */
export default function Canvas({store, initialSnapshot, children}: CanvasProps) {
    return (
        <Tldraw
            hideUi={true}
            onMount={handleMount}
            components={{Background: Background, OnTheCanvas: CanvasArea}}
            store={store}
            snapshot={ store ? undefined : initialSnapshot }
        >
            {children}
        </Tldraw>
    )
}