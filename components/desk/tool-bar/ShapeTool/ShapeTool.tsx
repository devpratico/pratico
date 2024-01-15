import ToolButton, {ToolId} from '../ToolButton/ToolButton'


interface ShapeToolProps {
    activeToolId:  string
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function ShapeTool({activeToolId, dispatch}: ShapeToolProps) {


    const shapeButtonProps = {
        toolId: "shape" as ToolId,
        onClick: ()=>dispatch<string, string>("clickedTool", "geo"),
        active: activeToolId === "image" || activeToolId === "video",
        //tooltipContent: <DrawingOptions {...drawingOptionsProps}/>
    }

    return <ToolButton {...shapeButtonProps}/>
}