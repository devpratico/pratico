import styles from './CustomUI.module.css'
import { Editor, useEditor, track, DefaultColorStyle } from "@tldraw/tldraw"
import ToolBar from '../../tool-bar/ToolBar/ToolBar'
import { ToolDispatch } from '../../tool-bar/ToolBar/ToolBar'
import { DrawOptionDispatch } from '../../tool-bar/tools-options/DrawingOptions/DrawingOptions'
import { ColorDispatch } from '../../tool-bar/tools-options/ColorsOptions/ColorsOptions'


const CustomUI = track(() => {
    const editor = useEditor()
    const activeToolId = editor.getCurrentToolId()
    const stylesForNextShapes = editor.getInstanceState().stylesForNextShape
    const activeColor = stylesForNextShapes["tldraw:color"] as string || "black"
    
    return (
        <div className={styles.customUI}>
            <ToolBar
                activeToolId={activeToolId}
                activeColor={activeColor}
                dispatch={(obj) => dispatchEditor(editor, obj)}
            />
        </div>
    )
})


function dispatchEditor(editor: Editor, dispatchObj: ToolDispatch | DrawOptionDispatch | ColorDispatch) {
    switch (dispatchObj.action) {
        case "clickedTool":
            editor.setCurrentTool(dispatchObj.payload)
            break
        case "clickedDrawOption":
            editor.setCurrentTool("draw")
            break
        case "clickedColor":
            editor.setStyleForNextShapes(DefaultColorStyle, dispatchObj.payload)
            break
    }

}


export default CustomUI