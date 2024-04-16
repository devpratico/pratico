import {
    Editor,
    TLDefaultColorStyle,
    TLDefaultSizeStyle,
    TLDefaultDashStyle,
    TLDefaultFontStyle,
    TLDefaultFillStyle,
    GeoShapeGeoStyle,
} from "tldraw";


export interface TldDrawState {
    activeTool: string;
    nextShape:  typeof GeoShapeGeoStyle.values[number];
    nextColor:  TLDefaultColorStyle;
    nextSize:   TLDefaultSizeStyle;
    nextDash:   TLDefaultDashStyle;
    nextFill:   TLDefaultFillStyle;
    nextFont:   TLDefaultFontStyle;
}

// TODO: maybe use the `computed` function from tldraw, to use a more reactive approach
export default function getTldDrawState(editor: Editor): TldDrawState {
    const activeToolId = editor.getCurrentToolId()
    const stylesForNextShapes = editor.getInstanceState().stylesForNextShape
    const activeColor = stylesForNextShapes["tldraw:color"]
    const activeSize  = stylesForNextShapes["tldraw:size"]
    const activeDash  = stylesForNextShapes["tldraw:dash"]  
    const activeFont  = stylesForNextShapes["tldraw:font"]
    const activeShape = stylesForNextShapes["tldraw:geo"]
    const activeFill  = stylesForNextShapes["tldraw:fill"]

    return {
        activeTool: activeToolId,
        nextShape:  activeShape as typeof GeoShapeGeoStyle.values[number],
        nextColor:  activeColor as TLDefaultColorStyle,
        nextSize:   activeSize  as TLDefaultSizeStyle,
        nextDash:   activeDash  as TLDefaultDashStyle,
        nextFill:   activeFill  as TLDefaultFillStyle,
        nextFont:   activeFont  as TLDefaultFontStyle,
    }
}