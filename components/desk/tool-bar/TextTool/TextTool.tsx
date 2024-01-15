import ToolButton from "../ToolButton/ToolButton";
import TextOptions from "../tools-options/TextOptions/TextOptions";
import { Color } from "../tools-options/ColorsOptions/ColorsOptions";
import { Font } from "../tools-options/TextOptions/TextOptions";


interface TextToolProps {
    active: boolean;
    activeColor: Color;
    isStickyNote: boolean;
    activeFont: Font;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function TextTool({active, activeColor, isStickyNote, activeFont, dispatch}: TextToolProps) {

    // We won't pass the original dispatch function.
    // We need to declare first that we come from the text tool.
    const dispatchTextOption = <A, P>(action: A, payload: P) => {
        // "Clicked option *from* text tool"
        dispatch<string, string>("clickedOption", "text")
        dispatch<A, P>(action, payload)
    }

    const textOptionsProps = {
        activeColor,
        isStickyNote,
        activeFont,
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