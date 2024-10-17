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
import { useTLEditor } from '@/app/(frontend)/_hooks/useTLEditor'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
//import Resizer from './custom-ui/Resizer/Resizer'
import EmbedHint from './custom-ui/EmbedHint/EmbedHint'
import logger from '@/app/_utils/logger'
import { Button } from '@radix-ui/themes'
import { useFullscreen } from '@/app/(frontend)/_hooks/useFullscreen'
import { Maximize2, Minimize2 } from 'lucide-react'

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
	const { setIsFullscreen, isFullscreen } = useFullscreen();
	const targetRef = useRef<HTMLDivElement>(null);
	const [ showButton, setShowButton ] = useState(true);

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
        //editor.setStyleForNextShapes(DefaultColorStyle, "black");
        //editor.setStyleForNextShapes(DefaultSizeStyle , "m");

    }, [setEditor, onMount])

    const options = useMemo(() => ({ maxPages: 300 }), [])

	const handleFullscreen = () => {
		if (targetRef.current)
		{
			if (targetRef.current.requestFullscreen)
			{
				setIsFullscreen(!isFullscreen);
				targetRef.current.requestFullscreen();
			}	
		}
	  };

	  useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isFullscreen)
			{
				document.exitFullscreen();
				setIsFullscreen(false);
		  	}
		};	
		window.addEventListener('keydown', handleKeyPress);

		return () => {
		  window.removeEventListener('keydown', handleKeyPress);
		};
	  }, [isFullscreen, setIsFullscreen]);
	
	  useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const { innerWidth, innerHeight } = window;
			const edgeDistance = 20;
			console.log('Mouse position:', e.clientX, e.clientY);
			console.log('Window size:', innerWidth, innerHeight);
			console.log('Edge distance:', edgeDistance);
			
			if (e.clientX < edgeDistance ||
			e.clientX > innerWidth - edgeDistance ||
			e.clientY < edgeDistance ||
			e.clientY > innerHeight - edgeDistance)
				setShowButton(true);
			else
				setShowButton(false);
		};
		logger.log('react:component', 'Canvas', 'EventListener mousemove', showButton);
		if (isFullscreen)
		{
			window.addEventListener('mousemove', handleMouseMove);

			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
			};
		}

	  }, [showButton, isFullscreen]);

    return (
		<>
			<Button hidden={!showButton} onClick={handleFullscreen}>{isFullscreen ? <Minimize2 /> : <Maximize2 />}</Button>
			<div ref={targetRef} style={{ width: '100%'}}>
				<Tldraw
					className='tldraw-canvas'
					hideUi={true}
					onMount={handleMount}
					components={{Background: Background, OnTheCanvas: CanvasArea}}
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
		</>
    )
}


const KeyboardShortcuts = () => {
    useKeyboardShortcuts()
    return null
}