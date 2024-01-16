import styles from './CustomUI.module.css'
import { useEditor, track, DefaultColorStyle, DefaultBrush, DefaultDashStyle, DefaultSizeStyle, DefaultFontStyle, DefaultHorizontalAlignStyle, defaultTools, defaultShapeTools, ShapeIndicator, GeoShapeTool, GeoShapeGeoStyle, AssetRecordType } from "@tldraw/tldraw"
import ToolBar from '../../tool-bar/ToolBar/ToolBar'
import { Color } from '../../tool-bar/tools-options/ColorsOptions/ColorsOptions'
import { Size, Dash } from '../../tool-bar/tools-options/LineOptions/LineOptions'
import { Font } from '../../tool-bar/tools-options/TextOptions/TextOptions'
import { Shape } from '../../tool-bar/tools-options/ShapeOptions/ShapeOptions'

/**
 * This component is a custom UI for the editor.
 * For now, it only contains the tool bar (left)
 */
const CustomUI = track(() => {
    const editor = useEditor() // This is provided by the parent Tldraw component
    const activeToolId = editor.getCurrentToolId()
    const isStickyNote = activeToolId === "note"
    const stylesForNextShapes = editor.getInstanceState().stylesForNextShape
    const activeColor = stylesForNextShapes["tldraw:color"] as Color || "black"
    const activeSize  = stylesForNextShapes["tldraw:size"]  as Size  || "l"
    const activeDash  = stylesForNextShapes["tldraw:dash"]  as Dash  || "solid"
    const activeFont  = stylesForNextShapes["tldraw:font"]  as Font  || "draw"
    let   activeShape = stylesForNextShapes["tldraw:geo"]   as Shape || "rectangle"
    if (activeToolId == "arrow") {
        activeShape = "arrow"
    }
    //const defaultToolsIds = defaultShapeTools.map(tool => tool.id) 
    //const defaultToolsIds = defaultTools.concat(defaultShapeTools).map(tool => tool.id)
    const defaultToolsIds = defaultTools.map(tool => tool.id).concat(defaultShapeTools.map(tool => tool.id))


    // useful to discover the styles cache
    //console.log(stylesForNextShapes)

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
                } else {
                    console.warn("Tool not recognized", payload)
                }
                break
            case "clickedShape":
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
                editor.setStyleForNextShapes(DefaultDashStyle, payload as string)
                break
            case "clickedFont":
                editor.setStyleForNextShapes(DefaultFontStyle, payload as string)
                break
            case "providedAnImage":
                //editor.setStyleForNextShapes(DefaultBrush, payload as string)
                console.log("providedAnImage")
                const imageSrc = payload as string
                const image = new Image()
                image.src = imageSrc
                const imageWidth  = image.width
                const imageHeight = image.height
                const aspectRatio = imageWidth / imageHeight
                const assetId = AssetRecordType.createId()

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
                break
            case "clickedOption":
                // from:
                switch (payload as string) {
                    case "draw":
                        // Set to draw only if not already draw or highlight or laser
                        if (!["draw", "highlight", "laser"].includes(activeToolId)) {
                            editor.setCurrentTool("draw")
                        }
                        break
                    case "text":
                        // Set only if not already text or note
                        if (!["text", "note"].includes(activeToolId)) {
                            editor.setCurrentTool("text")
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
    
    return (
        <div className={styles.customUI}>
            <ToolBar
                activeToolId={activeToolId}
                activeColor ={activeColor}
                activeSize  ={activeSize}
                activeDash  ={activeDash}
                isStickyNote={isStickyNote}
                activeFont  ={activeFont}
                activeShape ={activeShape}
                dispatch    ={dispatch}
            />
        </div>
    )
})

export default CustomUI