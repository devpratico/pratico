import ToolButton, {ToolId} from '../ToolButton/ToolButton'
import DrawingOptions from '../tools-options/DrawingOptions/DrawingOptions'
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import {Size, Dash, Tool} from '../tools-options/LineOptions/LineOptions';


interface DrawToolProps {
    active: boolean;
    activeColor: Color;
    activeSize:  Size;
    activeDash:  Dash;
    activeTool:  Tool;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function DrawTool({active, activeColor, activeSize, activeDash, activeTool, dispatch}: DrawToolProps) {

    /*
    const dispatchDrawOption = <A, P>(action: A, payload: P) => {
        dispatch<string, string>("clickedTool", "draw")
        dispatch<A, P>(action, payload)
    }
    */

    const drawingOptionsProps = {
        activeColor,
        activeSize,
        activeDash,
        activeTool,
        dispatch: dispatch
    }

    const drawButtonProps = {
        toolId: "draw" as ToolId,
        onClick: ()=>dispatch<string, string>("clickedTool", "draw"),
        active: active,
        tooltipContent: <DrawingOptions {...drawingOptionsProps}/>
    }

    return <ToolButton {...drawButtonProps}/>
} 