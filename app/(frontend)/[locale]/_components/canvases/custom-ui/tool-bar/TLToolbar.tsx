'use client'
import { track } from "tldraw"
import getTldrawState from "@/app/_utils/tldraw/tldDrawState"
import { toolBarStateFrom } from "@/app/_utils/tldraw/toolBarState"
import * as tlDispatch from '@/app/_utils/tldraw/toolbarDispatch'
import ToolBar from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/tool-bar/ToolBar/ToolBar"
import { useTLEditor } from "@/app/(frontend)/_hooks/useTLEditor"
import { useCallback } from "react"
import logger from "@/app/_utils/logger"

/*
/**
 * This is the toolbar of the canvas.
 * It takes the ToolBar component and wrap it inside `track` which is useful for tldraw.
 */
// TODO: don't use track and improve the code
const  TLToolbar = track(() => {
    const { editor } = useTLEditor()

    const dispatch = useCallback((action: string, payload: string) => {
        if (!editor) {
            logger.warn('react:hook', 'TLToolbar', 'dispatch', 'editor is not defined')
            return
        }
        tlDispatch.toolbarDispatch({editor, action, payload})
    }, [editor])
       
    const tldrawState = editor ? getTldrawState(editor) : undefined
    const toolBarState = tldrawState ? toolBarStateFrom(tldrawState) : undefined

    return <ToolBar state={toolBarState} dispatch={dispatch}/>
})


export default TLToolbar