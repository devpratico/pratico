import styles from './CustomUI.module.css'
import { useEditor, track, DefaultColorStyle, DefaultBrush, DefaultDashStyle, DefaultSizeStyle } from "@tldraw/tldraw"
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
    const stylesForNextShapes = editor.getInstanceState().stylesForNextShape
    const activeColor = stylesForNextShapes["tldraw:color"] as Color || "black"
    const activeSize  = stylesForNextShapes["tldraw:size"]  as Size || "m"
    const activeDash  = stylesForNextShapes["tldraw:dash"]  as Dash || "solid"

    /**
     * This function will be called by toolbar elements to dispatch actions
     * @example dispatch("clickedTool", "select")
     */
    function dispatch<A,P>(action: A, payload: P) {
        switch (action as string) {
            case "clickedTool":
                editor.setCurrentTool(payload as string)
                break
            case "clickedDrawOption":
                editor.setCurrentTool("draw")
                break
            case "clickedColor":
                editor.setStyleForNextShapes(DefaultColorStyle, payload as string)
                break
            case "clickedSize":
                editor.setStyleForNextShapes(DefaultSizeStyle, payload as string)
                break
            case "clickedDash":
                const newStyle = activeDash === "solid" ? "dashed" : "solid"
                editor.setStyleForNextShapes(DefaultDashStyle, newStyle)
                break
            default:
                console.error("Unknown action", action)
                break
        }
            
    }
    
    return (
        <div className={styles.customUI}>
            <ToolBar
                activeToolId={activeToolId}
                activeColor={activeColor}
                activeSize={activeSize}
                activeDash={activeDash}
                dispatch={dispatch}
            />
        </div>
    )
})

export default CustomUI