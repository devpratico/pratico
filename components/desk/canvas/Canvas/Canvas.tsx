'use client'
import styles from './Canvas.module.css'
import {
    Tldraw,
    Editor, 
    useEditor, 
    setUserPreferences, 
    Box2d, 
    DefaultColorStyle, 
    DefaultSizeStyle,
} from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect } from 'react'
import CustomUI from '../CustomUI/CustomUI'


/**
 * This function is called when the tldraw editor is mounted.
 * It's used to set some initial preferences.
 */
const handleMount = (editor: Editor) => {
    //editor.updateInstanceState({ canMoveCamera: false })
    setUserPreferences({ id: 'tldraw', edgeScrollSpeed: null })
    editor.setStyleForNextShapes(DefaultColorStyle, "blue");
    editor.setStyleForNextShapes(DefaultSizeStyle , "xl");
}

/**
 * This element is responsible for resizing the canvas to fit the window.
 * It doesn't actually render anything.
 */
const Resizer = () => {
    const editor = useEditor()
    const box = new Box2d(0, 0, 1920, 1080)

    const updateSize = () => {
        //const ratio = size.width / 1920
        //editor.setCamera({ x: 30, y: 30, z: ratio*0.9 })
        //editor.zoomToFit() //{duration: 200}
        editor.zoomToBounds(box, undefined, { duration: 200 })
    }

    let timeout: NodeJS.Timeout
    const debouncedUpdateSize = () => {
        clearTimeout(timeout)
        timeout = setTimeout(updateSize, 200)
    }
    
    useEffect(() => {
        updateSize()
        window.addEventListener('resize', debouncedUpdateSize);
        return () => window.removeEventListener('resize', debouncedUpdateSize)
    }, []) // TODO: there's a dependency array warning here

    return null
}

/**
 * This is the custom background of the canvas (light grey color).
 */
const CustomBackground  = () => <div className={styles.background}/>


/**
 * This is the white rectangle on the canvas.
 */
const CustomOnTheCanvas = () => <div className={styles.toileDeFond + " " + "smallShadow"}/>

/**
 * This is the main component of the canvas.
 * It contains the infinite canvas and the toolsbar.
 */
export default function Canvas() {
    return (
        <Tldraw
            hideUi={true}
            onMount={handleMount}
            components={{Background: CustomBackground, OnTheCanvas: CustomOnTheCanvas}}
        >
            <Resizer/>
            <CustomUI/>
        </Tldraw>
    )
}



