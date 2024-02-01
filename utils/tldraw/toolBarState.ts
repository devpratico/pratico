import { TLDefaultColorStyle, TLDefaultSizeStyle, TLDefaultFontStyle } from "@tldraw/tldraw";
import { TldrawState } from "./tldrawState";


export interface ToolBarState {
    /**
     * These are the tools displayed in the main toolbar. The rest are called "options".
     */
    activeTool: "select" | "draw" | "text" | "shape" | "media" | "eraser";

    drawOptions: {
        color: TLDefaultColorStyle;
        size:  TLDefaultSizeStyle;
        type: "normal" | "dotted" | "highlight" | "laser";
    };

    textOptions: {
        color: TLDefaultColorStyle;
        font:  TLDefaultFontStyle;
        type: "normal" | "stickyNote";
    };

    shapeOptions: {
        color: TLDefaultColorStyle;
        shape: "rectangle" | "ellipse" | "arrow" | "star";
        style: "empty" | "whiteFilled" | "colorFilled" | "dotted";
    };
}


export function toolBarStateFrom(tldState: TldrawState): ToolBarState {

    // Tldraw tools and our toolbar tools are not exactly the same
    let activeTool = "select";
    switch (tldState.activeTool) {
        case "select":
        case "draw":
        case "text":
        case "eraser":
            activeTool = tldState.activeTool;
            break;
        case "geo":
            activeTool = "shape";
            break;
        default:
            break;
    }

    // Get draw option `type` from info like `nextDash` and `activeTool`
    let drawType = "normal";
    if (tldState.activeTool == "draw" && tldState.nextDash == "dotted") {
        drawType = "dotted";
    } else if (tldState.activeTool == "highlight" || tldState.activeTool == "laser") {
        drawType = tldState.activeTool;
    }

    // Get text option `type` from tldraw's `activeTool`
    let textType = "normal";
    if (tldState.activeTool == "note") {
        textType = "stickyNote";
    }

    // Get shape from tldraw if we support it, otherwise default to "rectangle"
    let shape = "rectangle";
    switch (tldState.nextShape) {
        case "rectangle":
        case "ellipse":
        case "star":
            shape = tldState.nextShape;
            break;
    }
    if (tldState.activeTool == "arrow") {
        shape = "arrow";
    }

    // Get shape option `style` from info like `nextFill` and `nextDash`
    let shapeStyle = "empty";
    if (tldState.nextFill == "none" && tldState.nextDash == "solid") {
        shapeStyle = "empty";
    } else if (tldState.nextFill == "semi" && tldState.nextDash == "solid") {
        shapeStyle = "whiteFilled";
    } else if (tldState.nextFill == "solid" && tldState.nextDash == "solid") {
        shapeStyle = "colorFilled";
    } else if (tldState.nextFill == "none" && tldState.nextDash == "dotted") {
        shapeStyle = "dotted";
    }

    // Get font, if undefined, default to "draw"
    const font = tldState.nextFont || "draw";

    return {
        activeTool: activeTool as ToolBarState["activeTool"],
        drawOptions: {
            color: tldState.nextColor,
            size:  tldState.nextSize,
            type:  drawType as ToolBarState["drawOptions"]["type"],
        },
        textOptions: {
            color: tldState.nextColor,
            font:  font as ToolBarState["textOptions"]["font"],
            type:  textType as ToolBarState["textOptions"]["type"],
        },
        shapeOptions: {
            color: tldState.nextColor,
            shape: shape as ToolBarState["shapeOptions"]["shape"],
            style: shapeStyle as ToolBarState["shapeOptions"]["style"],
        },
    }
}

