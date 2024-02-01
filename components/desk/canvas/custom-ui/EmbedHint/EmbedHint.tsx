import { useEditor, track } from "@tldraw/tldraw";
import styles from './EmbedHint.module.css'


/**
 * Displays a hint on top of the embed shape when it's not being edited.
 * `Triple click to play!`
 */
const EmbedHint = track(() => {
    const editor = useEditor()
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
        <div
            className={styles.container}
            style={{
                left: hintPosition.x,
                top: hintPosition.y - 40,
                display: display,
            }}
        >
            Triple click to play!
        </div>
    )
})

export default EmbedHint