import styles from './ToolBar.module.css'
import ToolButton, { ToolId } from '../ToolButton/ToolButton';


interface ToolBarProps {
    activeToolId: string; // But should be a TlDrawToolId
    setTool: (toolId: ToolId) => void;
}

export default function ToolBar({activeToolId, setTool}: ToolBarProps) {
    return (
        <div className={`${styles.container} bigShadow`}>
            <ToolButton toolId="select" onClick={()=>setTool('select')} active={activeToolId === "select"}/>
            <ToolButton toolId="draw"   onClick={()=>setTool('draw')}   active={activeToolId === "draw"}/>
            <ToolButton toolId="eraser" onClick={()=>setTool('eraser')} active={activeToolId === "eraser"}/>
        </div>
    )
}