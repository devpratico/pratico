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
	TLFrameShape,
} from 'tldraw'
import 'tldraw/tldraw.css'
import Background from './custom-ui/Background'
import CanvasArea from './custom-ui/CanvasArea'
import { useTLEditor } from '@/app/(frontend)/_hooks/useTLEditor'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
    const { editor, setEditor } = useTLEditor();
	const [ canvasWidth, setCanvasWidth ] = useState<number | undefined>();

	useEffect(() => {
		console.log("PAGEBOUND", editor?.getCurrentPageBounds());
		if (!canvasWidth)
			setCanvasWidth(editor?.getCurrentPageBounds()?.w);
	}, [editor, canvasWidth]);
    /**
     * This function is called when the tldraw editor is mounted.
     * It's used to set some initial preferences.
     */
    const handleMount = useCallback((editor: Editor) => {
		const image = new Image();
		const imageWidth  = image.width
		const imageHeight = image.height
		const aspectRatio = imageWidth / imageHeight
		let imageWidthInEditor = imageWidth
		let imageHeightInEditor = imageHeight
		if (imageWidth > 1920) {
			imageWidthInEditor = window.innerWidth
			imageHeightInEditor = imageWidthInEditor / aspectRatio
		}
		if (imageHeight > 1080) {
			imageHeightInEditor = window.innerHeight
			imageWidthInEditor = imageHeightInEditor * aspectRatio
		}

        // Expose the editor to the outside world (`useTLEditor` hook)
        setEditor(editor)

        // Call the provided onMount function
        if (onMount) {
            onMount(editor)
        }
        const {x, y, w, h} = editor.getViewportPageBounds();
		editor.createShape<TLFrameShape>({
            type: 'frame',
			x: x,
			y: y,
			isLocked: true,
			props: {
				w: w,
				h: h,
			},
        })
        editor.setCameraOptions({
            wheelBehavior: 'none',
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
        //editor.setStyleForNextShapes(DefaultColorStyle, "black");
        //editor.setStyleForNextShapes(DefaultSizeStyle , "m");

    }, [setEditor, onMount])

    const options = useMemo(() => ({ maxPages: 300, infinite: false }), [])

    return (
		<div id='tldrawId' style={{ alignContent: 'center', width: canvasWidth || '100%'}}>
			<Tldraw
				className='tldraw-canvas'
				hideUi={true}
				onMount={handleMount}
				components={{ Background: Background, OnTheCanvas: CanvasArea }}
				store={store}
				snapshot={ store ? undefined : initialSnapshot }
				persistenceKey={persistenceKey}
				options={options}
			>
				{children}
				{/* <Resizer/> */}
				<EmbedHint/>
				<KeyboardShortcuts/>
			</Tldraw>
		</div>
    )
}


const KeyboardShortcuts = () => {
    useKeyboardShortcuts()
    return null
}