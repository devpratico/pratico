'use client'
import { track } from "@tldraw/tldraw"
import getTldrawState from "@/utils/tldraw/tldDrawState"
import { toolBarStateFrom } from "@/utils/tldraw/toolBarState"
import * as tlDispatch from '@/utils/tldraw/toolbarDispatch'
import ToolBar from "@/components/desk/tool-bar/ToolBar/ToolBar"
import { useTLEditor } from "@/hooks/useTLEditor"
import { useMemo } from "react"

/*
/**
 * This is the toolbar of the canvas.
 * It takes the ToolBar component and wrap it inside `track` which is useful for tldraw.
 */
// TODO: don't use track and improve the code
const  TLToolbar = () => {
    const { editor } = useTLEditor()
    const dispatch = useMemo(() => (action: string, payload: string) => {
        if (!editor) return
        tlDispatch.toolbarDispatch({editor, action, payload})
    }, [editor])
    
    if (!editor) {
        return <span>loading...</span>
    }
    

    const tldrawState = getTldrawState(editor)
    const toolBarState = toolBarStateFrom(tldrawState)

    return <ToolBar state={toolBarState} dispatch={dispatch}/>
}


export default TLToolbar