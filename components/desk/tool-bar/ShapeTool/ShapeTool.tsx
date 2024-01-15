import ToolButton, {ToolId} from '../ToolButton/ToolButton'
import ShapeOptions from '../tools-options/ShapeOptions/ShapeOptions';
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import { Shape } from '../tools-options/ShapeOptions/ShapeOptions';


interface ShapeToolProps {
    activeToolId:  string;
    activeColor: Color;
    activeShape: Shape;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function ShapeTool({activeToolId, activeColor, activeShape, dispatch}: ShapeToolProps) {

    // test
    const shapeButtonProps = {
        toolId: "shape" as ToolId,
        onClick: ()=>dispatch<string, string>("clickedTool", "geo"),
        active: activeToolId === "geo" || activeToolId === "arrow",
        tooltipContent: <ShapeOptions activeColor={activeColor} activeShape={activeShape} dispatch={dispatch}/>
    }

    return <ToolButton {...shapeButtonProps}/>
}