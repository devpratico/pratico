'use client'
import { Card, Flex, IconButton } from "@radix-ui/themes"
import { MousePointer2, Pen, Type, Shapes, Image as ImageLucid, Eraser } from 'lucide-react'
import { useTLEditor } from "@/app/(frontend)/_hooks/useTLEditor"
import { track, DefaultColorStyle, DefaultSizeStyle } from "tldraw"
import { useEffect } from "react"


const MobileToolbar = track(() => {
    const { editor } = useTLEditor()
    const activeToolId = editor?.getCurrentToolId()
    const iconSize = '27'

    useEffect(() => {
        editor?.setStyleForNextShapes(DefaultColorStyle, 'violet')
        editor?.setStyleForNextShapes(DefaultSizeStyle, 'xl')
    }, [editor])

    return (
        <Card variant='classic' style={{width:'100%'}}>
            <Flex justify='between'>

                <IconButton
                    variant='ghost'
                    data-state={activeToolId === 'select' ? 'open' : ''}
                    onClick={() => editor?.setCurrentTool('select')}
                >
                    <MousePointer2 size={iconSize} />
                </IconButton>

                <IconButton
                    variant='ghost'
                    data-state={activeToolId === 'draw' ? 'open' : ''}
                    onClick={() => editor?.setCurrentTool('draw')}
                >
                    <Pen size={iconSize} />
                </IconButton>

                <IconButton variant='ghost' disabled>
                    <Type size={iconSize} />
                </IconButton>

                <IconButton variant='ghost' disabled>
                    <Shapes size={iconSize} />
                </IconButton>

                <IconButton variant='ghost' disabled>
                    <ImageLucid size={iconSize} />
                </IconButton>

                <IconButton
                    variant='ghost'
                    data-state={activeToolId === 'eraser' ? 'open' : ''}
                    onClick={() => editor?.setCurrentTool('eraser')}
                >
                    <Eraser size={iconSize} />
                </IconButton>

            </Flex>
        </Card>
    )
})

export default MobileToolbar