'use client'
import {
    Tldraw,
    Editor, 
    setUserPreferences, 
    DefaultColorStyle, 
    DefaultSizeStyle,
} from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import Resizer from '../custom-ui/Resizer/Resizer'
import Background from '../custom-ui/Background/Background'
import CanvasArea from '../custom-ui/CanvasArea/CanvasArea'
import EmbedHint from '../custom-ui/EmbedHint/EmbedHint'
import TLToolbar from '../custom-ui/TLToolbar/TLToolbar'


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

/**
 * This is the main component of the canvas.
 * It contains the infinite canvas and the toolsbar.
 */
export default function Canvas() {
    return (
        <Tldraw
            hideUi={true}
            onMount={handleMount}
            components={{Background: Background, OnTheCanvas: CanvasArea}}
        >
            <Resizer/>
            <EmbedHint/>
            <TLToolbar/>
        </Tldraw>
    )
}