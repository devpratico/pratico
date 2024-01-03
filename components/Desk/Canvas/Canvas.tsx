'use client'
import styles from './Canvas.module.css'
import { Tldraw, Editor, useEditor, track, setUserPreferences, Box2d, DefaultColorStyle, DefaultSizeStyle } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect } from 'react'
import ToolBar from '../ToolBar/ToolBar'


export default function Canvas() {
    
    const handleMount = (editor: Editor) => {
        //editor.updateInstanceState({ canMoveCamera: false })
        setUserPreferences({ id: 'tldraw', edgeScrollSpeed: null })
        //editor.setStyleForNextShapes(DefaultColorStyle, "green");
        editor.setStyleForNextShapes(DefaultSizeStyle, "xl");
    }

    return (
        <Tldraw
            hideUi={true}
            onMount={handleMount}
            components={{
                Background:  () => <div className={styles.background}/>,
                OnTheCanvas: () => <div className={styles.toileDeFond + " " + "smallShadow"}/>
                //SnapLine: () => null,
            }}
        >
            <InsideEditorContext/>
            <CustomUI/>
        </Tldraw>
    )
}


const InsideEditorContext = () => {
    const editor = useEditor()
    const box = new Box2d(0, 0, 1920, 1080)

    const updateSize = () => {
        //const ratio = size.width / 1920
        //editor.setCamera({ x: 30, y: 30, z: ratio*0.9 })
        //editor.zoomToFit() //{duration: 200}
        editor.zoomToBounds(box, undefined, { duration: 200 })
        console.log("resize")
    }

    let timeout: NodeJS.Timeout
    const debouncedUpdateSize = () => {
        clearTimeout(timeout)
        timeout = setTimeout(updateSize, 200)
    }
    
    useEffect(() => {
        updateSize()
        window.addEventListener('resize', debouncedUpdateSize);
        return () => window.removeEventListener('resize', debouncedUpdateSize)
    }, [])

    return null
}

const CustomUI = track(() => {
    const editor = useEditor()
    const activeTool = editor.getCurrentToolId()
    
    return (
        <div className={styles.customUI}>
            <ToolBar
                activeToolId={activeTool}
                setTool={(toolId) => editor.setCurrentTool(toolId)}
            />
        </div>
    )
})