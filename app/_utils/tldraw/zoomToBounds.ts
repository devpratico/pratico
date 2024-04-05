import { Box, Editor, TLAnimationOptions } from 'tldraw'



interface Insets {
    /**
     * The top inset in pixels, to fit a menu bar for example.
     */
    top: number

    /**
     * The right inset in pixels, to fit a sidebar for example.
     */
    right: number

    /**
     * The bottom inset in pixels, to fit a footer bar for example.
     */
    bottom: number

    /**
     * The left inset in pixels, to fit a tool for example.
     */
    left: number
}

interface ZoomToBoundsArgs {
    /**
     * Tldraw editor instance.
     */
    editor: Editor

    /**
     * The box to fit in the viewport, i.e. the canvas (tldraw coordinates)
     */
    box: Box

    /**
     * The margin in pixels around the box.
     */
    margin?: number

    /**
     * The insets in pixels, to fit UI elements around the canvas.
     */
    insets?: Insets
    animation?: TLAnimationOptions
}

/**
 * Fit the box in the viewport, with some insets.
 * This is a custom version of tldraw's `editor.zoomToBounds()`.
 */
export default function zoomToBounds({
    editor,
    box,
    margin = 0,
    insets = {top: 0, right: 0, bottom: 0, left: 0},
    animation
}: ZoomToBoundsArgs) {
    //const viewportScreenBounds = editor.getViewportScreenBounds()
    const viewportScreenBounds = editor.getContainer().getBoundingClientRect()

    // Given the viewport, margin and insets, we can get the aspect ratio of the "usable" area
    const usableWidth  = viewportScreenBounds.width  - insets.left - insets.right  - 2*margin
    const usableHeight = viewportScreenBounds.height - insets.top  - insets.bottom - 2*margin
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
    const cInsetTop     = insets.top  / zoom
    const cInsetLeft    = insets.left / zoom

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