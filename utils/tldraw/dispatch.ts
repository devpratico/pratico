import {
    Editor,
    DefaultColorStyle,
    DefaultSizeStyle,
    DefaultFillStyle,
    DefaultDashStyle,
    DefaultFontStyle,
    GeoShapeGeoStyle,
    createShapeId,
    TLEmbedShape,
    AssetRecordType,
} from '@tldraw/tldraw'


interface DispatchArgs {
    editor: Editor,
    action: string,
    payload: string
}

export function dispatch({ editor, action, payload }: DispatchArgs) {
    console.log('dispatch', action, payload)

    switch (action) {

        case 'CLICK_TOOL':
            switch (payload) {
                case 'select':
                    editor.setCurrentTool('select')
                    break
                case 'draw':
                    editor.setCurrentTool('draw')
                    editor.setStyleForNextShapes(DefaultFillStyle, 'none')
                    break
                case 'text':
                    editor.setCurrentTool('text')
                    break
                case 'shape':
                    editor.setCurrentTool('geo')
                    break
                case 'media':
                    break
                case 'eraser':
                    editor.setCurrentTool('eraser')
                    break
                default:
                    console.warn('Tool not recognized', payload)
                    break
            }
            break
        
        case 'CLICK_COLOR':
            editor.setStyleForNextShapes(DefaultColorStyle, payload)
            break

        case 'CLICK_OPTION':
            switch (payload) {
                case 'draw':
                    editor.setCurrentTool('draw')
                    break
                case 'text':
                    editor.setCurrentTool('text')
                    break
                case 'shape':
                    editor.setCurrentTool('geo')
                    break
                case 'media':
                    break
                default:
                    console.warn('Option not recognized', payload)
                    break
            }
            break
        
        case 'CLICK_DRAW_SIZE':
            editor.setStyleForNextShapes(DefaultSizeStyle, payload)
            break
        
        case 'CLICK_DRAW_TYPE':
            switch (payload) {
                case 'solid':
                    editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
                    break
                case 'dotted':
                    editor.setStyleForNextShapes(DefaultDashStyle, 'dotted')
                    break
                case 'highlight':
                    editor.setCurrentTool('highlight')
                    break
                case 'laser':
                    editor.setCurrentTool('laser')
                    break
                default:
                    console.warn('Draw type not recognized', payload)
                    break
            }
            break

        case 'CLICK_FONT':
            editor.setStyleForNextShapes(DefaultFontStyle, payload)
            break

        case 'CLICK_TEXT_TYPE':
            switch (payload) {
                case 'stickyNote':
                    editor.setCurrentTool('note')
                    break
                case 'normal':
                    editor.setCurrentTool('text')
                    break
                default:
                    console.warn('Text type not recognized', payload)
                    break
            }
            break

        case 'CLICK_SHAPE_TYPE':
            switch (payload) {
                case 'rectangle':
                case 'ellipse':
                case 'star':
                    editor.setStyleForNextShapes(GeoShapeGeoStyle, payload)
                    break
                case 'arrow':
                    editor.setCurrentTool('arrow')
                    break
                default:
                    console.warn('Shape type not recognized', payload)
                    break
            }
            break

        case 'CLICK_SHAPE_STYLE':
            switch (payload) {
                case 'empty':
                    editor.setStyleForNextShapes(DefaultFillStyle, 'none')
                    editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
                    break
                case 'whiteFilled':
                    editor.setStyleForNextShapes(DefaultFillStyle, 'solid')
                    editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
                    break
                case 'colorFilled':
                    editor.setStyleForNextShapes(DefaultFillStyle, 'semi')
                    editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
                    break
                case 'dotted':
                    editor.setStyleForNextShapes(DefaultFillStyle, 'none')
                    editor.setStyleForNextShapes(DefaultDashStyle, 'dotted')
                    break
                default:
                    console.warn('Shape style not recognized', payload)
                    break
            }
            break

        case 'SUBMIT_YOUTUBE_URL':
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

        case 'CLICK_SUBMIT_IMAGE':
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

        case 'CLICK_MEDIA_TYPE':
            break

        default:
            console.warn('Action not handled', action, payload)
            break

    }


}

/*
CLICK_TOOL (can be media)
CLICK_COLOR
CLICK_OPTION (ex draw, text, shape)
CLICK_DRAW_SIZE
CLICK_DRAW_TYPE (solid, dotted, highlight, laser)
CLICK_TEXT_TYPE (stickyNote, normal)
CLICK_SHAPE_TYPE 
CLICK_SHAPE_STYLE
CLICK_SUBMIT_YOUTUBE_URL
CLICK_SUBMIT_IMAGE
CLICK_MEDIA_TYPE (image, video) do nothing
*/

/*

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
    */