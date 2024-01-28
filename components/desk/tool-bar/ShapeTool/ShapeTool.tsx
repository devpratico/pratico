import ToolButton, {ToolId} from '../ToolButton/ToolButton'
import ShapeOptions from '../tools-options/ShapeOptions/ShapeOptions';
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import { Shape, Style } from '../tools-options/ShapeOptions/ShapeOptions';


interface ShapeToolProps {
    activeToolId:  string;
    activeColor: Color;
    activeShape: Shape;
    activeStyle: Style;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function ShapeTool({activeToolId, activeColor, activeShape, activeStyle, dispatch}: ShapeToolProps) {

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
        active: activeToolId === "geo" || activeToolId === "arrow",
        tooltipContent: <ShapeOptions activeColor={activeColor} activeShape={activeShape} activeStyle={activeStyle} dispatch={dispatchShapeOption}/>
    }

    return <ToolButton {...shapeButtonProps}/>
}