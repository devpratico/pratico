import styles from './TLToolbar.module.css'
import { track, useEditor } from "@tldraw/tldraw"
import getTldrawState from "@/utils/tldraw/tldrawState"
import { toolBarStateFrom } from "@/utils/tldraw/toolBarState"
import * as tlDispatch from '@/utils/tldraw/dispatch'
import ToolBar from "@/components/desk/tool-bar/ToolBar/ToolBar"
import { useKeyboardShortcuts } from "@tldraw/tldraw"

/**
 * This is the toolbar of the canvas.
 * It takes the ToolBar component and wrap it inside `track`which is useful for tldraw.
 * It also positions the toolbar on the left of the canvas,
 * And provides the props using tldraw's editor.
 */
const  TLToolbar = track(() => {
    const editor = useEditor() // This is provided by the parent Tldraw component
    useKeyboardShortcuts()

    const tldrawState = getTldrawState(editor)
    const toolBarState = toolBarStateFrom(tldrawState)
    const dispatch = (action: string, payload: string) => {
        tlDispatch.dispatch({editor, action, payload})
    }

    return (
        <div className={styles.container}>
            <ToolBar state={toolBarState} dispatch={dispatch}/>
        </div>
    )
})


export default TLToolbar