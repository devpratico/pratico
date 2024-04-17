import ToolButton, {ToolId} from '../ToolButton/ToolButton'
import ShapeOptions from '../tools-options/ShapeOptions/ShapeOptions';
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import { Shape, Style } from '../tools-options/ShapeOptions/ShapeOptions';
import { ToolBarState } from '@/app/_utils/tldraw/toolBarState';


interface ShapeToolProps {
    active: boolean;
    state: ToolBarState["shapeOptions"];
    dispatch: (action: string, payload: string) => void;
}

export default function ShapeTool({active, state, dispatch}: ShapeToolProps) {

    // We won't pass the original dispatch function.
    // We need to declare first that we come from the shape tool.
    const dispatchShapeOption = (action: string, payload: string) => {
        // "Clicked option *from* text tool"
        dispatch("CLICK_OPTION", "shape")
        dispatch(action, payload)
    }

    const shapeButtonProps = {
        toolId: "shape" as ToolId,
        onClick: ()=>dispatch("CLICK_TOOL", "shape"),
        active: active,
        tooltipContent: <ShapeOptions state={state} dispatch={dispatchShapeOption}/>
    }

    return <ToolButton {...shapeButtonProps}/>
}