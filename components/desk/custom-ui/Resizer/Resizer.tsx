'use client'
import { useEffect, useMemo } from "react"
import { track, useEditor, Box } from "@tldraw/tldraw"
import zoomToBounds from "@/utils/tldraw/zoomToBounds"
import logger from "@/utils/logger"
import { useUi } from "@/hooks/useUi"


/**
 * This element is responsible for resizing the canvas to fit the window.
 * It doesn't actually render anything.
 */
const Resizer = track(() => {
    const editor = useEditor()
    const { isMobile } = useUi()

    const currentPage = editor.getCurrentPage()
    const box = new Box(0, 0, 1920, 1080)

    /*
    let insets = {top: 60, right: 0, bottom: 70, left: 60}
    if (isMobile) {
        insets = {top: 0, right: 50, bottom: 0, left: 50}
    }*/

    const insets = useMemo(() => {
        if (isMobile) {
            return {top: 0, right: 50, bottom: 0, left: 50}
        } else {
            return {top: 60, right: 0, bottom: 70, left: 60}
        }
    }, [isMobile])

    useEffect(() => {

        const updateSize = () => {
            zoomToBounds({ editor, box, margin: 10,  insets })
        }
    
        /*
        let timeout: NodeJS.Timeout
        const debouncedUpdateSize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(updateSize, 200)
        }*/

        updateSize()
        //window.addEventListener('resize', debouncedUpdateSize);
        window.addEventListener('resize', updateSize)
        return () => {
            //window.removeEventListener('resize', debouncedUpdateSize)
            //clearTimeout(timeout)
            window.removeEventListener('resize', updateSize)
        }
    }, [currentPage, insets]) // TODO: there's a dependency array warning here

    return null
})

export default Resizer