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
    TLAnimationOptions,
} from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect } from 'react'
import CustomUI from '../CustomUI/CustomUI'


/**
 * This function is called when the tldraw editor is mounted.
 * It's used to set some initial preferences.
 */
const handleMount = (editor: Editor) => {
    editor.updateInstanceState({ canMoveCamera: false })
    setUserPreferences({ id: 'tldraw', edgeScrollSpeed: null })
    editor.setStyleForNextShapes(DefaultColorStyle, "black");
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
        const insets = {top: 0, right: 0, bottom: 0, left: 67}
        zoomToBounds({ editor, box, insets, animation: { duration: 200 } })
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


interface Insets {
    top: number
    right: number
    bottom: number
    left: number
}

interface ZoomToBoundsArgs {
    editor: Editor
    box: Box2d
    insets?: Insets
    animation?: TLAnimationOptions
}

/**
 * Fit the box in the viewport, with some insets.
 * This is a custom version of tldraw's `editor.zoomToBounds()`.
 */
function zoomToBounds({ editor, box, insets, animation }: ZoomToBoundsArgs) {
    //const viewportScreenBounds = editor.getViewportScreenBounds()
    const viewportScreenBounds = editor.getContainer().getBoundingClientRect()
    const margin = 5 //px
    const _insets = insets || {top: 0, right: 0, bottom: 0, left: 0}

    // Given the viewport, margin and insets, we can get the aspect ratio of the "usable" area
    const usableWidth  = viewportScreenBounds.width  - _insets.left - _insets.right  - 2*margin
    const usableHeight = viewportScreenBounds.height - _insets.top  - _insets.bottom - 2*margin
    const usableAspectRatio = usableWidth / usableHeight

    // Let's compare the aspect ratio of the usable area with the aspect ratio of the box
    const boxAspectRatio = box.width / box.height
    const usableAreaIsWider = usableAspectRatio > boxAspectRatio

    // let's compute a zoom that will fit the box in the usable area
    const zoom = usableAreaIsWider ? usableHeight/box.height : usableWidth/box.width

    // Convert some values to canvas coordinates
    const cMargin       = margin       / zoom
    const cUsableWidth  = usableWidth  / zoom
    const cUsableHeight = usableHeight / zoom
    const cInsetTop     = _insets.top  / zoom
    const cInsetLeft    = _insets.left / zoom
    console.log("cMargin", cMargin)
    console.log("cUsableWidth", cUsableWidth)
    console.log("cUsableHeight", cUsableHeight)
    console.log("cInsetTop", cInsetTop)
    console.log("cInsetLeft", cInsetLeft)

    // Now we can compute the camera position (top-left corner of the camera view)
    // So that the box is centered in the usable area
    const cameraX = -cMargin - cInsetLeft - (usableAreaIsWider ? (cUsableWidth - box.width) / 2 : 0)
    const cameraY = -cMargin - cInsetTop  - (usableAreaIsWider ? 0 : (cUsableHeight - box.height) / 2)

    editor.setCamera({
            x: -cameraX,
            y: -cameraY,
            z: zoom,
        },
        animation
    )
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



