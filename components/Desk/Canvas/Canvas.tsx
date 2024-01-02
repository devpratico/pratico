'use client'
import styles from './Canvas.module.css'
import { Tldraw, Editor, useEditor, createShapeId, setUserPreferences, Box2d } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect } from 'react'


export default function Canvas() {
    
    const handleMount = (editor: Editor) => {
        editor.createShape({
            id: createShapeId("toile"),
            type: 'geo',
            x: 0,
            y: 0,
            isLocked: true,
            props: {
                geo: 'rectangle',
                w: 1920,
                h: 1080,
                dash: 'draw',
                color: 'blue',
                fill: 'solid',
                size: 'm',
            }
        })

        //editor.zoomToFit()
        //editor.updateInstanceState({ canMoveCamera: false })
        setUserPreferences({ id: 'tldraw', edgeScrollSpeed: 0 })

    }

    return (
        <Tldraw
            onMount={handleMount}
            /** 
            components={{
                Background: () => <div className={styles.background}/>,
            }}*/
        >
            <InsideEditorContext/>
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