import ToolButton, {ToolId} from '../ToolButton/ToolButton'
import DrawingOptions from '../tools-options/DrawingOptions/DrawingOptions'
import { Color } from '../tools-options/ColorsOptions/ColorsOptions';
import {Size, Dash, Tool} from '../tools-options/LineOptions/LineOptions';
import { ToolBarState } from '@/app/_utils/tldraw/toolBarState';


type DrawToolState = ToolBarState["drawOptions"]

interface DrawToolProps {
    active: boolean;
    state: DrawToolState;
    dispatch: (action: string, payload: string) => void;
}

export default function DrawTool({active, state, dispatch}: DrawToolProps) {

    const drawButtonProps = {
        toolId: "draw" as ToolId,
        onClick: ()=>dispatch("CLICK_TOOL", "draw"),
        active: active,
        tooltipContent: <DrawingOptions state={state} dispatch={dispatch}/>
    }

    return <ToolButton {...drawButtonProps}/>
} 