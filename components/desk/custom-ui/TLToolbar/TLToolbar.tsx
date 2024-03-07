'use client'
import { track, useEditor } from "@tldraw/tldraw"
import getTldrawState from "@/utils/tldraw/tldDrawState"
import { toolBarStateFrom } from "@/utils/tldraw/toolBarState"
import * as tlDispatch from '@/utils/tldraw/toolbarDispatch'
import ToolBar from "@/components/desk/tool-bar/ToolBar/ToolBar"
import { useKeyboardShortcuts } from "@tldraw/tldraw"

/**
 * This is the toolbar of the canvas.
 * It takes the ToolBar component and wrap it inside `track` which is useful for tldraw.
 */
// TODO: don't use track and improve the code
const  TLToolbar = track(() => {
    const editor = useEditor() // This is provided by the parent Tldraw component
    useKeyboardShortcuts()

    const tldrawState = getTldrawState(editor)
    const toolBarState = toolBarStateFrom(tldrawState)
    const dispatch = (action: string, payload: string) => {
        tlDispatch.toolbarDispatch({editor, action, payload})
    }

    return <ToolBar state={toolBarState} dispatch={dispatch}/>
})


export default TLToolbar