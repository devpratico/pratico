import ToolButton from "../ToolButton/ToolButton";
import TextOptions from "../tools-options/TextOptions/TextOptions";
import { ToolBarState } from "@/app/_utils/tldraw/toolBarState";


interface TextToolProps {
    active: boolean;
    state: ToolBarState["textOptions"];
    dispatch: (action: string, payload: string) => void;
}

export default function TextTool({active, state, dispatch}: TextToolProps) {

    // We won't pass the original dispatch function.
    // We need to declare first that we come from the text tool.
    const dispatchTextOption = (action: string, payload: string) => {
        // "Clicked option *from* text tool"
        dispatch("CLICK_OPTION", "text")
        dispatch(action, payload)
    }

    const textOptionsProps = {
        state: state,
        dispatch: dispatchTextOption
    }
    
    return (
        <ToolButton
            toolId="text"
            onClick={()=>dispatch("CLICK_TOOL", "text")}
            active={active}
            tooltipContent={<TextOptions {...textOptionsProps}/>}
        />
    )
}