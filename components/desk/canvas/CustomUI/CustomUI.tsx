'use client'
import styles from './CustomUI.module.css'
import { useEditor, track, DefaultColorStyle, DefaultFillStyle, DefaultDashStyle, DefaultSizeStyle, DefaultFontStyle, DefaultHorizontalAlignStyle, defaultTools, defaultShapeTools, ShapeIndicator, GeoShapeTool, GeoShapeGeoStyle, AssetRecordType, EmbedShapeUtil, TLShapeId, TLEmbedShape, createShapeId } from "@tldraw/tldraw"
import ToolBar from '../../tool-bar/ToolBar/ToolBar'
import { Color } from '../../tool-bar/tools-options/ColorsOptions/ColorsOptions'
import { Size, Dash } from '../../tool-bar/tools-options/LineOptions/LineOptions'
import { Font } from '../../tool-bar/tools-options/TextOptions/TextOptions'
import { Shape, Style } from '../../tool-bar/tools-options/ShapeOptions/ShapeOptions'
import getTldrawState from '@/utils/tldraw/tldrawState'
import { toolBarStateFrom } from '@/utils/tldraw/toolBarState'

/**
 * This component is a custom UI for the editor.
 * For now, it only contains the tool bar (left)
 */
const CustomUI = track(() => {
    const editor = useEditor() // This is provided by the parent Tldraw component
    const tldrawState = getTldrawState(editor)
    const toolBarState = toolBarStateFrom(tldrawState)

    //const defaultToolsIds = defaultShapeTools.map(tool => tool.id) 
    //const defaultToolsIds = defaultTools.concat(defaultShapeTools).map(tool => tool.id)
    const defaultToolsIds = defaultTools.map(tool => tool.id).concat(defaultShapeTools.map(tool => tool.id))

    /**
     * This function will be called by toolbar elements to dispatch actions
     * @example dispatch("clickedTool", "select")
     */
    function dispatch<A,P>(action: A, payload: P) {
        console.log("dispatch", action, payload)
        switch (action as string) {
            case "clickedTool":
                if (defaultToolsIds.includes(payload as string)) {
                    editor.setCurrentTool(payload as string)
                    if (payload === "draw") {
                        editor.setStyleForNextShapes(DefaultFillStyle, "none")
                    } 
                } else {
                    console.warn("Tool not recognized", payload)
                }
                break
            case "clickedShape":
                editor.setCurrentTool("geo")
                editor.setStyleForNextShapes(DefaultSizeStyle, "m")
                editor.setStyleForNextShapes(DefaultFillStyle, "solid");
                editor.setStyleForNextShapes(DefaultDashStyle, "solid");
                editor.setStyleForNextShapes(GeoShapeGeoStyle, payload as string)
                break
            case "clickedColor":
                editor.setStyleForNextShapes(DefaultColorStyle, payload as string)
                break
            case "clickedSize":
                editor.setStyleForNextShapes(DefaultSizeStyle, payload as string)
                break
            case "clickedDash":
                editor.setCurrentTool("draw") // We want to go back to draw even if we are in highlight or laser
                editor.setStyleForNextShapes(DefaultFillStyle, "none")
                editor.setStyleForNextShapes(DefaultDashStyle, payload as string)
                break
            case "clickedFont":
                editor.setStyleForNextShapes(DefaultFontStyle, payload as string)
                break
            case "clickedStyle":
                switch (payload as string) {
                    case "emptySolid":
                        editor.setStyleForNextShapes(DefaultFillStyle, "none")
                        editor.setStyleForNextShapes(DefaultDashStyle, "solid")
                        break
                    case "fillSolid":
                        editor.setStyleForNextShapes(DefaultFillStyle, "solid")
                        editor.setStyleForNextShapes(DefaultDashStyle, "solid")
                        break
                    case "emptyDotted":
                        editor.setStyleForNextShapes(DefaultFillStyle, "none")
                        editor.setStyleForNextShapes(DefaultDashStyle, "dotted")
                        break
                    case "whiteSolid":
                        editor.setStyleForNextShapes(DefaultFillStyle, "semi")
                        editor.setStyleForNextShapes(DefaultDashStyle, "solid")
                        break
                    default:
                        console.warn("Style not handled", payload)
                        break
                }
                break
            case "providedAnImage":
                const imageSrc = payload as string

                // We could directly create an image using imageSrc, but we want to get the image size first
                // To get the size, we need to create an Image element to access its width and height
                // But width and height are only available after the image is loaded
                // So we need to continue in the onload handler
                const image = new Image()
                const assetId = AssetRecordType.createId()

                // This handler will be called when the image is done loading
                image.onload = () => {
                    const imageWidth  = image.width
                    const imageHeight = image.height
                    const aspectRatio = imageWidth / imageHeight

                    editor.createAssets([
                        {
                            id: assetId,
                            type: 'image',
                            typeName: 'asset',
                            props: {
                                name: 'tldraw.png',
                                src: imageSrc,
                                w: imageWidth,
                                h: imageHeight,
                                mimeType: 'image/png',
                                isAnimated: false,
                            },
                            meta: {},
                        },
                    ])
    
                    // Calculate the size of the image to fit in the editor
                    let imageWidthInEditor = imageWidth
                    let imageHeightInEditor = imageHeight
                    if (imageWidth > 1920) {
                        imageWidthInEditor = window.innerWidth
                        imageHeightInEditor = imageWidthInEditor / aspectRatio
                    }
                    if (imageHeight > 1080) {
                        imageHeightInEditor = window.innerHeight
                        imageWidthInEditor = imageHeightInEditor * aspectRatio
                    }
    
                    editor.createShape({
                        type: 'image',
                        // Let's center the image in the editor
                        x: (1920 - imageWidthInEditor)  / 2,
                        y: (1080 - imageHeightInEditor) / 2,
                        props: {
                            assetId,
                            w: imageWidthInEditor,
                            h: imageHeightInEditor,
                        },
                    })
                }

                image.src = imageSrc
                
                break


            case "SubmitYouTubeVideoURL":
                const resizeRatio = 0.5
                const width = 1920 * resizeRatio
                const height = 1080 * resizeRatio
                const x = (1920 - width) / 2
                const y = (1080 - height) / 2
                const shapeId = createShapeId()
                editor.createShape<TLEmbedShape>({
                    id: shapeId,
                    type: 'embed', 
                    x: x,
                    y: y, 
                    props: {
                        url: payload as string,
                        w: width,
                        h: height,
                    }
                })
                editor.setCurrentTool("select")
                break


            case "clickedOption":
                // from:
                switch (payload as string) {
                    case "draw":
                        // Set to draw only if not already draw or highlight or laser
                        if (!["draw", "highlight", "laser"].includes(tldrawState.activeTool)) {
                            editor.setStyleForNextShapes(DefaultFillStyle, "none")
                            editor.setCurrentTool("draw")
                        }
                        break
                    case "text":
                        // Set only if not already text or note
                        if (!["text", "note"].includes(tldrawState.activeTool)) {
                            editor.setCurrentTool("text")
                        }
                        break
                    case "shape":
                        // Set only if not already geo or arrow
                        if (!["geo", "arrow"].includes(tldrawState.activeTool)) {
                            //editor.setStyleForNextShapes(DefaultFillStyle, "solid")
                            editor.setCurrentTool("geo")
                        }
                        break
                    default:
                        console.warn("Option not handled", payload)
                        break
                }
                break


            default:
                console.warn("Action not handled", action, payload)
                break
        }
    }


    let hintPosition = {x: 0, y: 0}
    let display = "none"
    const selectedShapesIds = editor.getSelectedShapeIds()
    if (selectedShapesIds.length > 0) {
        const firstSelectedShapeId = selectedShapesIds[0]
        const shape = editor.getShape(firstSelectedShapeId)
        const isEmbed = shape?.type === "embed"
        const isInteracting = editor.getEditingShapeId() === firstSelectedShapeId
        if (isEmbed && !isInteracting) {
            display = "block"
            const bounds = editor.getShapePageBounds(firstSelectedShapeId)
            if (bounds) {
                const screenPoint = editor.pageToScreen(bounds)
                const screenBounds = editor.getViewportScreenBounds()
                hintPosition = {
                    x: screenPoint.x - screenBounds.x,
                    y: screenPoint.y - screenBounds.y,
                }
            }
        }
    }
    
    return (
        <>
        <div className={styles.customUI}>
            <ToolBar state={toolBarState} dispatch={dispatch}/>
        </div>

        <div
        style={{
            position: "absolute",
            left: hintPosition.x,
            top: hintPosition.y - 40,
            padding: 7,
            background: "var(--secondary)",
            color: "var(--text-on-secondary)",
            borderRadius: 10,
            zIndex: 1000,
            display: display,
        }}
        >Double click to interact!</div>
        </>
    )
})

export default CustomUI