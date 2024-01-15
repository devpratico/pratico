import styles from './CustomUI.module.css'
import { useEditor, track, DefaultColorStyle, DefaultBrush, DefaultDashStyle, DefaultSizeStyle, DefaultFontStyle, DefaultHorizontalAlignStyle, defaultShapeTools, ShapeIndicator, GeoShapeTool, GeoShapeGeoStyle } from "@tldraw/tldraw"
import ToolBar from '../../tool-bar/ToolBar/ToolBar'
import { Color } from '../../tool-bar/tools-options/ColorsOptions/ColorsOptions'
import { Size, Dash } from '../../tool-bar/tools-options/LineOptions/LineOptions'
import { Font } from '../../tool-bar/tools-options/TextOptions/TextOptions'

/**
 * This component is a custom UI for the editor.
 * For now, it only contains the tool bar (left)
 */
const CustomUI = track(() => {
    const editor = useEditor() // This is provided by the parent Tldraw component
    const activeToolId = editor.getCurrentToolId()
    const isStickyNote = activeToolId === "note"
    const stylesForNextShapes = editor.getInstanceState().stylesForNextShape
    const activeColor = stylesForNextShapes["tldraw:color"] as Color || "black"
    const activeSize  = stylesForNextShapes["tldraw:size"]  as Size  || "l"
    const activeDash  = stylesForNextShapes["tldraw:dash"]  as Dash  || "solid"
    const activeFont  = stylesForNextShapes["tldraw:font"]  as Font  || "draw"

    // useful to discover the styles cache
    //console.log(stylesForNextShapes)

    /**
     * This function will be called by toolbar elements to dispatch actions
     * @example dispatch("clickedTool", "select")
     */
    function dispatch<A,P>(action: A, payload: P) {
        console.log("dispatch", action, payload)
        switch (action as string) {
            case "clickedTool":
                if (payload==='geo') {
                    editor.setStyleForNextShapes(GeoShapeGeoStyle, 'star')
                }
                editor.setCurrentTool(payload as string)
                break
            case "clickedColor":
                editor.setStyleForNextShapes(DefaultColorStyle, payload as string)
                break
            case "clickedSize":
                editor.setStyleForNextShapes(DefaultSizeStyle, payload as string)
                break
            case "clickedDash":
                editor.setCurrentTool("draw") // We want to go back to draw even if we are in highlight or laser
                editor.setStyleForNextShapes(DefaultDashStyle, payload as string)
                break
            case "clickedFont":
                editor.setStyleForNextShapes(DefaultFontStyle, payload as string)
                break
            case "clickedOption":
                // from:
                switch (payload as string) {
                    case "draw":
                        // Set to draw only if not already draw or highlight or laser
                        if (!["draw", "highlight", "laser"].includes(activeToolId)) {
                            editor.setCurrentTool("draw")
                        }
                        break
                    case "text":
                        // Set only if not already text or note
                        if (!["text", "note"].includes(activeToolId)) {
                            editor.setCurrentTool("text")
                        }
                        break
                    default:
                        console.warn("Option not handled", payload)
                        break
                }
                break
            default:
                console.warn("Action not handled", action, payload)
                break
        }
    }
    
    return (
        <div className={styles.customUI}>
            <ToolBar
                activeToolId={activeToolId}
                activeColor ={activeColor}
                activeSize  ={activeSize}
                activeDash  ={activeDash}
                isStickyNote={isStickyNote}
                activeFont  ={activeFont}
                dispatch    ={dispatch}
            />
        </div>
    )
})

export default CustomUI