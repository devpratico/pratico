'use client'
import { useEffect, useRef, useCallback } from "react"
import { useEditor, Box } from "tldraw"
import zoomToBounds from "@/app/_utils/tldraw/zoomToBounds"
import logger from "@/app/_utils/logger"
import { useNav } from "@/app/_hooks/useNav"



interface ResizerProps {
    insets?: {top: number, right: number, bottom: number, left: number}
    margin?: number
}


/**
 * This element is responsible for resizing the canvas to fit the window.
 * It doesn't actually render anything.
 */
export default function Resizer({ insets, margin }: ResizerProps) {
    const editor = useEditor()
    const { currentPageId } = useNav()
    const resizeObserverRef = useRef<ResizeObserver | null>(null)


    const updateSize = useCallback(() => {
        const box = new Box(0, 0, 1920, 1080)
        zoomToBounds({ editor, box, margin,  insets })
        logger.log('tldraw:editor', 'Resized')
    }, [editor, insets, margin])

    // Update size on mount
    useEffect(() => {
        updateSize()
    }, [updateSize])

    // Update size on window resize
    /*
    useEffect(() => {
        let timeout: NodeJS.Timeout
        const debouncedUpdateSize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(updateSize, 10)
        }

        window.addEventListener('resize', debouncedUpdateSize);

        return () => {
            window.removeEventListener('resize', debouncedUpdateSize)
            clearTimeout(timeout)
        }
    }, [updateSize])*/

    // Update size when the element with the specific class is resized
    useEffect(() => {
        const element = document.getElementsByClassName('tldraw-canvas')[0]

        if (element) {
            resizeObserverRef.current = new ResizeObserver(() => {
                updateSize()
            })
            resizeObserverRef.current.observe(element)
        }

        return () => {
            if (resizeObserverRef.current && element) {
                resizeObserverRef.current.unobserve(element)
                resizeObserverRef.current.disconnect()
            }
        }
    }, [updateSize])

    // Update size when the current page changes
    useEffect(() => {
        updateSize()
    }, [currentPageId, updateSize])

    return null
}