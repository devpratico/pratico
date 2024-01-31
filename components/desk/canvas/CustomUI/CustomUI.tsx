'use client'
import styles from './CustomUI.module.css'
import { useEditor, track } from "@tldraw/tldraw"
import ToolBar from '../../tool-bar/ToolBar/ToolBar'
import getTldrawState from '@/utils/tldraw/tldrawState'
import { toolBarStateFrom } from '@/utils/tldraw/toolBarState'
import * as tlDispatch from '@/utils/tldraw/dispatch'

/**
 * This component is a custom UI for the editor.
 * For now, it only contains the tool bar (left)
 */
const CustomUI = track(() => {
    const editor = useEditor() // This is provided by the parent Tldraw component
    const tldrawState = getTldrawState(editor)
    const toolBarState = toolBarStateFrom(tldrawState)
    const dispatch = (action: string, payload: string) => {
        tlDispatch.dispatch({editor, action, payload})
    }

    let hintPosition = {x: 0, y: 0}
    let display = "none"
    const selectedShapesIds = editor.getSelectedShapeIds()
    if (selectedShapesIds.length > 0) {
        const firstSelectedShapeId = selectedShapesIds[0]
        const shape = editor.getShape(firstSelectedShapeId)
        const isEmbed = shape?.type === "embed"
        const isInteracting = editor.getEditingShapeId() === firstSelectedShapeId
        if (isEmbed && !isInteracting) {
            display = "block"
            const bounds = editor.getShapePageBounds(firstSelectedShapeId)
            if (bounds) {
                const screenPoint = editor.pageToScreen(bounds)
                const screenBounds = editor.getViewportScreenBounds()
                hintPosition = {
                    x: screenPoint.x - screenBounds.x,
                    y: screenPoint.y - screenBounds.y,
                }
            }
        }
    }
    
    return (
        <>
        <div className={styles.customUI}>
            <ToolBar state={toolBarState} dispatch={dispatch}/>
        </div>

        <div
        style={{
            position: "absolute",
            left: hintPosition.x,
            top: hintPosition.y - 40,
            padding: 7,
            background: "var(--secondary)",
            color: "var(--text-on-secondary)",
            borderRadius: 10,
            zIndex: 1000,
            display: display,
        }}
        >Double click to interact!</div>
        </>
    )
})

export default CustomUI