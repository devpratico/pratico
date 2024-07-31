'use client'
import {
    Tldraw,
    Editor,
    getUserPreferences,
    setUserPreferences, 
    DefaultColorStyle, 
    DefaultSizeStyle,
    TLStoreWithStatus,
    TLStore,
    StoreSnapshot,
    TLRecord,
    useKeyboardShortcuts,
} from 'tldraw'
import 'tldraw/tldraw.css'
import Background from './custom-ui/Background'
import CanvasArea from './custom-ui/CanvasArea'
import { useTLEditor } from '@/app/_hooks/useTLEditor'
import { useCallback } from 'react'
//import Resizer from './custom-ui/Resizer/Resizer'
import EmbedHint from './custom-ui/EmbedHint/EmbedHint'
import logger from '@/app/_utils/logger'


export interface CanvasUser {
    id: string
    name: string
    color: string
}

export interface CanvasProps {
    store?: TLStoreWithStatus | TLStore
    initialSnapshot?: StoreSnapshot<TLRecord>
    persistenceKey?: string
    onMount?: (editor: Editor) => void
    //user: CanvasUser
    children?: React.ReactNode
}

/**
 * This is the canvas component provided by tldraw.
 * It is a client component. We use [Desk](../Desk/Desk.tsx) to load server components (i.e. the ToolBar) inside.
 */
export default function Canvas({store, initialSnapshot, persistenceKey, onMount, children}: CanvasProps) {

    const { setEditor } = useTLEditor()

    /**
     * This function is called when the tldraw editor is mounted.
     * It's used to set some initial preferences.
     */
    const handleMount = useCallback((editor: Editor) => {

        // Expose the editor to the outside world (`useTLEditor` hook)
        setEditor(editor)

        // Call the provided onMount function
        if (onMount) {
            onMount(editor)
        }

        editor.setCameraOptions({
            wheelBehavior: 'none'
        })

        
        /**
         * Set the user preferences
         * Instead of overwriting the whole object, we use the already existing preferences and overwrite some of them
         * This is useful if the user has already set its `name` before - we don't redirect him to the student-form page.
         * For the user id, we take the supabase user id (if it exists) or the already existing id (if it exists - if not, tldraw will generate a new one)
         */
        setUserPreferences({
            ...getUserPreferences(),
            //id: user.id,
            //name: user.name,
            //color: user.color,
            edgeScrollSpeed: 0
        })
        logger.log('tldraw:editor', 'Canvas mounted with usePreferences', getUserPreferences())

        //editor.updateInstanceState({ canMoveCamera: false })
        editor.setStyleForNextShapes(DefaultColorStyle, "black");
        editor.setStyleForNextShapes(DefaultSizeStyle , "m");
    }, [setEditor, onMount])

    return (
        <Tldraw
            className='tldraw-canvas'
            hideUi={true}
            onMount={handleMount}
            components={{Background: Background, OnTheCanvas: CanvasArea}}
            store={store}
            snapshot={ store ? undefined : initialSnapshot }
            persistenceKey={persistenceKey}
        >
            {children}
            {/*<Resizer/>*/}
            <EmbedHint/>
            <KeyboardShortcuts/>
        </Tldraw>
    )
}


const KeyboardShortcuts = () => {
    useKeyboardShortcuts()
    return null
}