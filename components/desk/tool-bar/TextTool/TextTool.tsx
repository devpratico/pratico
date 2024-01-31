import ToolButton from "../ToolButton/ToolButton";
import TextOptions from "../tools-options/TextOptions/TextOptions";
import { ToolBarState } from "@/utils/tldraw/toolBarState";


interface TextToolProps {
    active: boolean;
    state: ToolBarState["textOptions"];
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function TextTool({active, state, dispatch}: TextToolProps) {

    // We won't pass the original dispatch function.
    // We need to declare first that we come from the text tool.
    const dispatchTextOption = <A, P>(action: A, payload: P) => {
        // "Clicked option *from* text tool"
        dispatch<string, string>("clickedOption", "text")
        dispatch<A, P>(action, payload)
    }

    const textOptionsProps = {
        state: state,
        dispatch: dispatchTextOption
    }
    
    return (
        <ToolButton
            toolId="text"
            onClick={()=>dispatch<string, string>("clickedTool", "text")}
            active={active}
            tooltipContent={<TextOptions {...textOptionsProps}/>}
        />
    )
}