import styles from './ToolBar.module.css'
import ToolButton, { ToolId } from '../ToolButton/ToolButton';
import DrawingOptions, { DrawOptionDispatch} from '../tools-options/DrawingOptions/DrawingOptions';
import { ColorDispatch } from '../tools-options/ColorsOptions/ColorsOptions';

type Action = "clickedTool";
type Tool = "select" | "draw" | "eraser";
export type ToolDispatch = {action: Action, payload: Tool};

interface ToolBarProps {
    activeToolId: string; // But should be a TlDrawToolId
    //setTool: (toolId: ToolId) => void;
    activeColor: string;
    //setColor: (color: string) => void;
    dispatch: (_: ToolDispatch | DrawOptionDispatch | ColorDispatch) => void;
}

export default function ToolBar({activeToolId, activeColor, dispatch}: ToolBarProps) {

    const dispatchTool = (toolId: ToolId) => {
        dispatch({action: "clickedTool", payload: toolId})
    }

    const dispatchDrawOption = (drawOptionDispatch: DrawOptionDispatch | ColorDispatch) => {
        dispatchTool("draw")
        dispatch(drawOptionDispatch)
    }

    const drawButtonProps = {
        toolId: "draw" as ToolId,
        onClick: ()=>dispatchTool('draw'),
        active: activeToolId === "draw",
        tooltipContent: <DrawingOptions dispatch={dispatchDrawOption} activeColor={activeColor}/>
    }

    return (
        <div className={`${styles.container} bigShadow`}>
            <ToolButton toolId="select" onClick={()=>dispatchTool('select')} active={activeToolId === "select"}/>
            <ToolButton {...drawButtonProps}/>
            <ToolButton toolId="eraser" onClick={()=>dispatchTool('eraser')} active={activeToolId === "eraser"}/>
        </div>
    )
}