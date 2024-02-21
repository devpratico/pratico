'use client'
import { useEffect } from "react"
import { track, useEditor, Box2d } from "@tldraw/tldraw"
import zoomToBounds from "@/utils/tldraw/zoomToBounds"
import logger from "@/utils/logger"


/**
 * This element is responsible for resizing the canvas to fit the window.
 * It doesn't actually render anything.
 */
const Resizer = track(() => {
    const editor = useEditor()
    const box = new Box2d(0, 0, 1920, 1080)
    const insets = {top: 56, right: 0, bottom: 70, left: 60}

    const updateSize = () => {
        logger.log('tldraw:editor', 'Resize canvas')
        zoomToBounds({ editor, box, margin: 10,  insets, animation: { duration: 200 } })
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
    }, [editor]) // TODO: there's a dependency array warning here

    return null
})

export default Resizer