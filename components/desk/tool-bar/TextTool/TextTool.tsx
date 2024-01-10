import ToolButton from "../ToolButton/ToolButton";
import TextOptions from "../tools-options/text-options/TextOptions/TextOptions";
import { Color } from "../tools-options/ColorsOptions/ColorsOptions";


interface TextToolProps {
    active: boolean;
    activeColor: Color;
    isStickyNote: boolean;
    alignText: "start" | "middle" | "end";
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function TextTool({active, activeColor, isStickyNote, alignText, dispatch}: TextToolProps) {

    // We won't pass the original dispatch function.
    // We need to declare first that we come from the text tool.
    const dispatchTextOption = <A, P>(action: A, payload: P) => {
        dispatch<string, string>("clickedTool", "text")
        dispatch<A, P>(action, payload)
    }

    const textOptionsProps = {
        activeColor,
        isStickyNote,
        alignText,
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