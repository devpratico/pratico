import styles from './ToolBar.module.css'
import DrawTool from '../DrawTool/DrawTool';
import SelectTool from '../SelectTool/SelectTool';
import EraserTool from '../EraserTool/EraserTool';
import TextTool from '../TextTool/TextTool';
import MediaTool from '../media-tool/MediaTool/MediaTool';
import ShapeTool from '../ShapeTool/ShapeTool';
import { ToolBarState } from '@/utils/tldraw/toolBarState';


interface ToolBarProps {
    state: ToolBarState;
    dispatch: (action: string, payload: string) => void;
}

export default function ToolBar({state, dispatch}: ToolBarProps) {

    return (
        <div className={`${styles.container} bigShadow`}>
            <SelectTool active={state.activeTool == "select"} dispatch={dispatch}/>
            <DrawTool   active={state.activeTool == "draw"} state={state.drawOptions} dispatch={dispatch}/>
            <TextTool   active={state.activeTool == "text"} state={state.textOptions} dispatch={dispatch}/>
            <ShapeTool  active={state.activeTool == "shape"} state={state.shapeOptions} dispatch={dispatch}/>
            <MediaTool  active={state.activeTool == "media"} dispatch={dispatch}/>
            <EraserTool active={state.activeTool == "eraser"} dispatch={dispatch}/>
        </div>
    )
}