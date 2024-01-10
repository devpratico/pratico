import styles from './ToolBar.module.css'
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import {Size, Dash, Tool} from '../tools-options/LineOptions/LineOptions';
import DrawTool from '../DrawTool/DrawTool';
import SelectTool from '../SelectTool/SelectTool';
import EraserTool from '../EraserTool/EraserTool';
import TextTool from '../TextTool/TextTool';


interface ToolBarProps {
    activeToolId: string; // But should be a TlDrawToolId
    activeColor: Color;
    activeSize: Size;
    activeDash: Dash;
    isStickyNote: boolean;
    alignText: "start" | "middle" | "end";
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function ToolBar({activeToolId, activeColor, activeSize, activeDash, isStickyNote, alignText, dispatch}: ToolBarProps) {
    return (
        <div className={`${styles.container} bigShadow`}>
            <SelectTool active={activeToolId === "select"} dispatch={dispatch}/>
            <DrawTool   active={activeToolId === "draw"} activeColor={activeColor} activeSize={activeSize} activeDash={activeDash} activeTool={activeToolId as Tool} dispatch={dispatch}/>
            <TextTool   active={activeToolId === "text"} activeColor={activeColor} isStickyNote={isStickyNote} alignText={alignText} dispatch={dispatch}/>
            <EraserTool active={activeToolId === "eraser"} dispatch={dispatch}/>
        </div>
    )
}