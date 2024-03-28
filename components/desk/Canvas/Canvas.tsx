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
import Background from '../custom-ui/Background/Background'
import CanvasArea from '../custom-ui/CanvasArea/CanvasArea'
import { getRandomColor } from '@/utils/codeGen'
import { useTLEditor } from '@/hooks/useTLEditor'
import { useCallback } from 'react'
import Resizer from '../custom-ui/Resizer/Resizer'
import EmbedHint from '../custom-ui/EmbedHint/EmbedHint'
import { useAuth } from '@/hooks/useAuth'
import logger from '@/utils/logger'


export interface CanvasProps {
    store?: TLStoreWithStatus | TLStore
    /**
     * The initial snapshot of the store. Should not be used if the store is provided.
     */
    initialSnapshot?: StoreSnapshot<TLRecord>
    persistenceKey?: string
    children?: React.ReactNode
}

/**
 * This is the canvas component provided by tldraw.
 * It is a client component. We use [Desk](../Desk/Desk.tsx) to load server components (i.e. the ToolBar) inside.
 */
export default function Canvas({store, initialSnapshot, persistenceKey, children}: CanvasProps) {

    const { setEditor } = useTLEditor()
    const { user } = useAuth()

    /**
     * This function is called when the tldraw editor is mounted.
     * It's used to set some initial preferences.
     */
    const handleMount = useCallback((editor: Editor) => {

        // Expose the editor to the outside world (`useTLEditor` hook)
        setEditor(editor)

        /**
         * Set the user preferences
         * Instead of overwriting the whole object, we use the already existing preferences and overwrite some of them
         * This is useful if the user has already set its `name` before - we don't redirect him to the student-form page.
         * For the user id, we take the supabase user id (if it exists) or the already existing id (if it exists - if not, tldraw will generate a new one)
         */
        const userPref = getUserPreferences()
        const userId = user?.id
        setUserPreferences({
            ...userPref,
            id: userId || userPref.id,
            color: getRandomColor(),
            edgeScrollSpeed: 0
        })
        logger.log('tldraw:editor', 'Canvas mounted with usePreferences', getUserPreferences())

        editor.updateInstanceState({ canMoveCamera: false })
        editor.setStyleForNextShapes(DefaultColorStyle, "black");
        editor.setStyleForNextShapes(DefaultSizeStyle , "m");
    }, [setEditor, user])

    return (
        <Tldraw
            hideUi={true}
            onMount={handleMount}
            components={{Background: Background, OnTheCanvas: CanvasArea}}
            store={store}
            snapshot={ store ? undefined : initialSnapshot }
            persistenceKey={persistenceKey}
        >
            {children}
            <Resizer/>
            <EmbedHint/>
            <KeyboardShortcuts/>
        </Tldraw>
    )
}


const KeyboardShortcuts = () => {
    useKeyboardShortcuts()
    return null
}