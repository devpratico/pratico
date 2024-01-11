import styles from './CustomUI.module.css'
import { useEditor, track, DefaultColorStyle, DefaultBrush, DefaultDashStyle, DefaultSizeStyle, DefaultFontStyle, DefaultHorizontalAlignStyle } from "@tldraw/tldraw"
import ToolBar from '../../tool-bar/ToolBar/ToolBar'
import { Color } from '../../tool-bar/tools-options/ColorsOptions/ColorsOptions'
import { Size, Dash } from '../../tool-bar/tools-options/LineOptions/LineOptions'

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
    const textAlign   = stylesForNextShapes["tldraw:horizontalAlign"] as "start" | "middle" | "end" || "start"

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
                editor.setCurrentTool(payload as string)
                break
            case "clickedColor":
                editor.setStyleForNextShapes(DefaultColorStyle, payload as string)
                break
            case "clickedSize":
                editor.setStyleForNextShapes(DefaultSizeStyle, payload as string)
                break
            case "clickedDash":
                editor.setCurrentTool("draw")
                editor.setStyleForNextShapes(DefaultDashStyle, payload as string)
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
                    default:
                        console.warn("Option not handled", payload)
                        break
                }
                break
            case "clickedTextOption": // TODO: handle like above
                switch (payload as string) {
                    case "sticky-note":
                        editor.setCurrentTool(isStickyNote ? "select" : "note")
                        break
                    case "align-left":
                        editor.setStyleForNextShapes(DefaultHorizontalAlignStyle, "start")
                        break
                    case "align-center":
                        editor.setStyleForNextShapes(DefaultHorizontalAlignStyle, "middle")
                        break
                    case "align-right":
                        editor.setStyleForNextShapes(DefaultHorizontalAlignStyle, "end")
                        break
                    default:
                        console.warn("Text option not handled", payload)
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
                alignText   ={textAlign}
                dispatch    ={dispatch}
            />
        </div>
    )
})

export default CustomUI