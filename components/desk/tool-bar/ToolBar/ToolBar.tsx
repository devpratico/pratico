import styles from './ToolBar.module.css'
import ToolButton, { ToolId } from '../ToolButton/ToolButton';
import DrawingOptions from '../tools-options/DrawingOptions/DrawingOptions';


interface ToolBarProps {
    activeToolId: string; // But should be a TlDrawToolId
    setTool: (toolId: ToolId) => void;
}

export default function ToolBar({activeToolId, setTool}: ToolBarProps) {

    const drawButtonProps = {
        toolId: "draw" as ToolId,
        onClick: ()=>setTool('draw'),
        active: activeToolId === "draw",
        tooltipContent: <DrawingOptions />
    }

    return (
        <div className={`${styles.container} bigShadow`}>
            <ToolButton toolId="select" onClick={()=>setTool('select')} active={activeToolId === "select"}/>
            <ToolButton {...drawButtonProps}/>
            <ToolButton toolId="eraser" onClick={()=>setTool('eraser')} active={activeToolId === "eraser"}/>
        </div>
    )
}