'use client'
import { useEffect, useMemo, useCallback } from "react"
import { useEditor, Box } from "tldraw"
import zoomToBounds from "@/utils/tldraw/zoomToBounds"
import logger from "@/utils/logger"
import useWindow from "@/hooks/useWindow"
import { useNav } from "@/hooks/useNav"


/**
 * This element is responsible for resizing the canvas to fit the window.
 * It doesn't actually render anything.
 */
const Resizer = () => {
    const editor = useEditor()
    const { isMobile, orientation } = useWindow()
    const { currentPageId } = useNav()

    

    const insets = useMemo(() => {
        if (isMobile && orientation === 'landscape') {
            return {top: 0, right: 50, bottom: 0, left: 50}
        } else if (isMobile && orientation === 'portrait') {
            return {top: 0, right: 0, bottom: 0, left: 0}
        } else {
            return {top: 60, right: 0, bottom: 70, left: 60}
        }
    }, [isMobile, orientation])


    const updateSize = useCallback(() => {
        const box = new Box(0, 0, 1920, 1080)
        zoomToBounds({ editor, box, margin: 10,  insets })
        logger.log('tldraw:editor', 'Resized')
    }, [editor, insets])


    useEffect(() => {
        let timeout: NodeJS.Timeout
        const debouncedUpdateSize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(updateSize, 10)
        }

        updateSize()
        window.addEventListener('resize', debouncedUpdateSize);
        //window.addEventListener('resize', updateSize)
        return () => {
            window.removeEventListener('resize', debouncedUpdateSize)
            clearTimeout(timeout)
            //window.removeEventListener('resize', updateSize)
        }
    }, [currentPageId, insets, updateSize]) // TODO: there's a dependency array warning here

    return null
}

export default Resizer