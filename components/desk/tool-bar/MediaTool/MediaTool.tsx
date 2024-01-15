import ToolButton, {ToolId} from '../ToolButton/ToolButton'


interface MediaToolProps {
    activeToolId:  string
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function MediaTool({activeToolId, dispatch}: MediaToolProps) {


    const mediaButtonProps = {
        toolId: "image" as ToolId,
        onClick: ()=>dispatch<string, string>("clickedTool", "geo"),
        active: activeToolId === "image" || activeToolId === "video",
        //tooltipContent: <DrawingOptions {...drawingOptionsProps}/>
    }

    return <ToolButton {...mediaButtonProps}/>
}