'use client'
import { track } from "tldraw"
import getTldrawState from "@/app/_utils/tldraw/tldDrawState"
import { toolBarStateFrom } from "@/app/_utils/tldraw/toolBarState"
import * as tlDispatch from '@/app/_utils/tldraw/toolbarDispatch'
import ToolBar from "@/app/_components/desk/tool-bar/ToolBar/ToolBar"
import { useTLEditor } from "@/app/_hooks/useTLEditor"
import { useCallback } from "react"

/*
/**
 * This is the toolbar of the canvas.
 * It takes the ToolBar component and wrap it inside `track` which is useful for tldraw.
 */
// TODO: don't use track and improve the code
const  TLToolbar = track(() => {
    const { editor } = useTLEditor()

    const dispatch = useCallback((action: string, payload: string) => {
        if (!editor) return
        tlDispatch.toolbarDispatch({editor, action, payload})
    }, [editor])
       
    const tldrawState = editor ? getTldrawState(editor) : undefined
    const toolBarState = tldrawState ? toolBarStateFrom(tldrawState) : undefined

    return <ToolBar state={toolBarState} dispatch={dispatch}/>
})


export default TLToolbar