import ToolOptionsContainer from "../ToolOptionsContainer/ToolOptionsContainer";
import ColorsOptions, { Color } from "../ColorsOptions/ColorsOptions";
import styles from "./TextOptions.module.css";
import FontDrawIcon from "@/public/icons/FontDrawIcon";
import FontSerifIcon from "@/public/icons/FontSerifIcon";
import FontSansIcon from "@/public/icons/FontSansIcon";
import StickyIcon from "@/components/icons/StickyIcon";
import TextAreaIcon from "@/components/icons/TextAreaIcon";
import { ToolBarState } from "@/utils/tldraw/toolBarState";


type Action = "clickedOption" | "clickedTool" | "clickedFont";
type Tool = "text" | "note";
export type Font = "draw" | "sans" | "serif" | "mono";

interface TextOptionsProps {
    state: ToolBarState["textOptions"];
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function TextOptions({state, dispatch}: TextOptionsProps) {

    // Before dispatching the option, we need to declare that we come from the text tool.
    // We'll be able to switch automatically to the text tool when clicking on an option (i.e. color)
    // Except if the current tool is "note" for example.
    const dispatchOption = <A, P>(action: A, payload: P) => {
        dispatch<Action, Tool>("clickedOption", "text")
        dispatch<A, P>(action, payload)
    }

    
    function StickyNoteButton() {
        //const stickyNoteIcon = <FontAwesomeIcon icon={faStickyNote} size="xl"/>;
        const stickyNoteIcon = <StickyIcon fill={state.type == "stickyNote"}/>
        const className = styles.button + " " + styles.double + " " +(state.type == "stickyNote" ? styles.active : "")
        const dispatchStickyNote = () => dispatch<Action, Tool>("clickedTool", "note")
        return <button key={"note"} title={"Sticky note"} className={className} onClick={dispatchStickyNote} >{stickyNoteIcon}</button>
    }


    function TextAreaButton() {
        const textAreaIcon = <TextAreaIcon/>
        const className = styles.button + " " + styles.double + " " + (!(state.type == "stickyNote") ? styles.active : "")
        const dispatchTextArea = () => dispatch<Action, Tool>("clickedTool", "text")
        return <button key={"text"} title={"Free text area"} className={className} onClick={dispatchTextArea} >{textAreaIcon}</button>
    }

    function FontButton(font: Font) {
        const fontIconsMap = {
            "draw":  <FontDrawIcon/>,
            "sans":  <FontSansIcon/>,
            "serif": <FontSerifIcon/>,
            "mono":  <FontSansIcon/>
        }
        const fontIcon = fontIconsMap[font]
        const className = styles.button + " " + (state.font === font ? styles.active : "")
        const dispatchFont = () => dispatchOption<Action, Font>("clickedFont", font)
        return <button key={font} title={`Font - ${font}`} className={className} onClick={dispatchFont} >{fontIcon}</button>
    }


    return (
        <ToolOptionsContainer>
            <ColorsOptions activeColor={state.color} dispatch={dispatchOption}/>
            {FontButton("draw")}
            {FontButton("sans")}
            {FontButton("serif")}
            {FontButton("mono")}
            <TextAreaButton/>
            <StickyNoteButton/>
        </ToolOptionsContainer>
    )
}