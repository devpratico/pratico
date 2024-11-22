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
	createShapeId,
} from 'tldraw'
import 'tldraw/tldraw.css'
import Background from './custom-ui/Background'
import CanvasArea from './custom-ui/CanvasArea'
import { useTLEditor } from '@/app/(frontend)/_hooks/useTLEditor'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
//import Resizer from './custom-ui/Resizer/Resizer'
import EmbedHint from './custom-ui/EmbedHint/EmbedHint'
import logger from '@/app/_utils/logger'
import { useNav } from '@/app/(frontend)/_hooks/useNav'

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
	const { currentPageId, pageIds } = useNav();

	useEffect(() => {
		if (!editor)
			return ;

		const searchId = pageIds?.find((item) => {
			return (item === currentPageId);
		});

		if ((!searchId || !searchId.length) && currentPageId)
		{
			const { x,y,w,h } = editor.getViewportPageBounds();
			const newFrameId = createShapeId();
			editor.createShape<TLFrameShape>({
				id: newFrameId,
				type: 'frame',
				x: x * 2,
				y: y * 2,
				isLocked: true,
				props: {
					name: '\u200B', // zero-width space not to have a text above the frame
					w: w * 2,
					h: h * 2,
				},
			});
		}
		
	}, [editor, currentPageId, pageIds]);
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
            wheelBehavior: 'none',
        })
		const {x, y, w, h} = editor.getViewportPageBounds();
		console.log("HERE")
		editor.createShape<TLFrameShape>({
			type: 'frame',
			x: x * 2,
			y: y * 2,
			isLocked: true,
			props: {
				name: '\u200B', // zero-width space not to have a text above the frame
				w: w * 2,
				h: h * 2,
			},
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

    const options = useMemo(() => ({ maxPages: 300 }), [])

    return (
		<div id='tldrawId' style={{ alignContent: 'center', width: '100%'}}>
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