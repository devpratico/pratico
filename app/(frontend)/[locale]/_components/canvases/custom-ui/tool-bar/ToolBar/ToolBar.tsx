import styles from './ToolBar.module.css'
import DrawTool from '../DrawTool/DrawTool';
import SelectTool from '../SelectTool/SelectTool';
import EraserTool from '../EraserTool/EraserTool';
import TextTool from '../TextTool/TextTool';
import MediaTool from '../media-tool/MediaTool/MediaTool';
import ShapeTool from '../ShapeTool/ShapeTool';
import { ToolBarState } from '@/app/_utils/tldraw/toolBarState';


interface ToolBarProps {
    className?: string;
    state?: ToolBarState;
    dispatch: (action: string, payload: string) => void;
}

export default function ToolBar({className, state = blankState, dispatch}: ToolBarProps) {


    return (
        <div className={`${styles.container} ${className}`}>
            <SelectTool active={state.activeTool == "select"} dispatch={dispatch}/>
            <DrawTool   active={state.activeTool == "draw"} state={state.drawOptions} dispatch={dispatch}/>
            <TextTool   active={state.activeTool == "text"} state={state.textOptions} dispatch={dispatch}/>
            <ShapeTool  active={state.activeTool == "shape"} state={state.shapeOptions} dispatch={dispatch}/>
            <MediaTool  active={state.activeTool == "media"} dispatch={dispatch}/>
            <EraserTool active={state.activeTool == "eraser"} dispatch={dispatch}/>
        </div>
    )
}


const blankState: ToolBarState = {
    activeTool: "select",
    drawOptions: {
        color: "black",
        size: "m",
        type: "normal",
    },
    textOptions: {
        color: "black",
        font: "draw",
        type: "normal",
    },
    shapeOptions: {
        color: "black",
        shape: "rectangle",
        style: "empty",
    }
}