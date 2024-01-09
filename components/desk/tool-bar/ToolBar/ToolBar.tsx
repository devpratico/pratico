import styles from './ToolBar.module.css'
import ToolButton, { ToolId } from '../ToolButton/ToolButton';
import DrawingOptions from '../tools-options/DrawingOptions/DrawingOptions';
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import {Size, Dash} from '../tools-options/LineOptions/LineOptions';


type Action = "clickedTool";
type Tool = "select" | "draw" | "eraser";

interface ToolBarProps {
    activeToolId: string; // But should be a TlDrawToolId
    activeColor: Color;
    activeSize: Size;
    activeDash: Dash;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function ToolBar({activeToolId, activeColor, activeSize, activeDash, dispatch}: ToolBarProps) {

    const dispatchTool = (toolId: ToolId) => {
        dispatch<Action, Tool>("clickedTool", toolId)
    }

    const dispatchDrawOption = <A, P>(action: A, payload: P) => {
        dispatchTool("draw")
        dispatch<A, P>(action, payload)
    }

    const drawButtonProps = {
        toolId: "draw" as ToolId,
        onClick: ()=>dispatchTool('draw'),
        active: activeToolId === "draw",
        tooltipContent: <DrawingOptions dispatch={dispatchDrawOption} activeColor={activeColor} activeSize={activeSize} activeDash={activeDash}/>
    }

    return (
        <div className={`${styles.container} bigShadow`}>
            <ToolButton toolId="select" onClick={()=>dispatchTool('select')} active={activeToolId === "select"}/>
            <ToolButton {...drawButtonProps}/>
            <ToolButton toolId="eraser" onClick={()=>dispatchTool('eraser')} active={activeToolId === "eraser"}/>
        </div>
    )
}