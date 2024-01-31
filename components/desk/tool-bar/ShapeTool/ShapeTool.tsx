import ToolButton, {ToolId} from '../ToolButton/ToolButton'
import ShapeOptions from '../tools-options/ShapeOptions/ShapeOptions';
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import { Shape, Style } from '../tools-options/ShapeOptions/ShapeOptions';
import { ToolBarState } from '@/utils/tldraw/toolBarState';


interface ShapeToolProps {
    active: boolean;
    state: ToolBarState["shapeOptions"];
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function ShapeTool({active, state, dispatch}: ShapeToolProps) {

    // We won't pass the original dispatch function.
    // We need to declare first that we come from the shape tool.
    const dispatchShapeOption = <A, P>(action: A, payload: P) => {
        // "Clicked option *from* text tool"
        dispatch<string, string>("clickedOption", "shape")
        dispatch<A, P>(action, payload)
    }

    const shapeButtonProps = {
        toolId: "shape" as ToolId,
        onClick: ()=>dispatch<string, string>("clickedTool", "geo"),
        active: active,
        tooltipContent: <ShapeOptions state={state} dispatch={dispatchShapeOption}/>
    }

    return <ToolButton {...shapeButtonProps}/>
}