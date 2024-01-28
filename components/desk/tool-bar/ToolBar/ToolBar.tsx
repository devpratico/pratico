import styles from './ToolBar.module.css'
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import {Size, Dash, Tool} from '../tools-options/LineOptions/LineOptions';
import DrawTool from '../DrawTool/DrawTool';
import SelectTool from '../SelectTool/SelectTool';
import EraserTool from '../EraserTool/EraserTool';
import TextTool from '../TextTool/TextTool';
import MediaTool from '../media-tool/MediaTool/MediaTool';
import ShapeTool from '../ShapeTool/ShapeTool';
import { Font } from '../tools-options/TextOptions/TextOptions';
import { Shape, Style } from '../tools-options/ShapeOptions/ShapeOptions';


interface ToolBarProps {
    activeToolId: string; // But should be a TlDrawToolId
    activeColor: Color;
    activeSize: Size;
    activeDash: Dash;
    isStickyNote: boolean;
    activeFont: Font;
    activeShape: Shape;
    activeStyle: Style;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function ToolBar({activeToolId, activeColor, activeSize, activeDash, isStickyNote, activeFont, activeShape, activeStyle, dispatch}: ToolBarProps) {

    const drawIsActive = ["draw", "highlight", "laser"].includes(activeToolId)
    const textIsActive = ["text", "note"].includes(activeToolId)

    return (
        <div className={`${styles.container} bigShadow`}>
            <SelectTool active={activeToolId === "select"} dispatch={dispatch}/>
            <DrawTool   active={drawIsActive} activeColor={activeColor} activeSize={activeSize} activeDash={activeDash} activeTool={activeToolId as Tool} dispatch={dispatch}/>
            <TextTool   active={textIsActive} activeColor={activeColor} isStickyNote={isStickyNote} activeFont={activeFont} dispatch={dispatch}/>
            <ShapeTool  activeToolId={activeToolId} activeColor={activeColor} activeShape={activeShape} activeStyle={activeStyle} dispatch={dispatch}/>
            <MediaTool  activeToolId={activeToolId} dispatch={dispatch}/>
            <EraserTool active={activeToolId === "eraser"} dispatch={dispatch}/>
        </div>
    )
}