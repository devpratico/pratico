import ToolOptionsContainer from "../ToolOptionsContainer/ToolOptionsContainer";
import ColorsOptions, { Color } from "../ColorsOptions/ColorsOptions";
import styles from "./TextOptions.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";
import FontDrawIcon from "@/public/icons/FontDrawIcon";
import FontSerifIcon from "@/public/icons/FontSerifIcon";
import FontSansIcon from "@/public/icons/FontSansIcon";
import StickyIcon from "@/components/icons/StickyIcon";


type Action = "clickedOption" | "clickedTool" | "clickedFont";
type Tool = "text" | "note";
export type Font = "draw" | "sans" | "serif" | "mono";

interface TextOptionsProps {
    activeColor: Color;
    isStickyNote: boolean;
    activeFont: Font;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function TextOptions({activeColor, isStickyNote, activeFont, dispatch}: TextOptionsProps) {

    // Before dispatching the option, we need to declare that we come from the text tool.
    // We'll be able to switch automatically to the text tool when clicking on an option (i.e. color)
    // Except if the current tool is "note" for example.
    const dispatchOption = <A, P>(action: A, payload: P) => {
        dispatch<Action, Tool>("clickedOption", "text")
        dispatch<A, P>(action, payload)
    }

    
    function StickyNoteButton() {
        //const stickyNoteIcon = <FontAwesomeIcon icon={faStickyNote} size="xl"/>;
        const stickyNoteIcon = <StickyIcon fill={false}/>
        const className = styles.button + " " + (isStickyNote ? styles.active : "")
        const dispatchStickyNote = () => dispatch<Action, Tool>("clickedTool", "note")
        return <button key={"note"} className={className} onClick={dispatchStickyNote} >{stickyNoteIcon}</button>
    }

    function FontButton(font: Font) {
        const fontIconsMap = {
            "draw":  <FontDrawIcon/>,
            "sans":  <FontSansIcon/>,
            "serif": <FontSerifIcon/>,
            "mono":  <FontSansIcon/>
        }
        const fontIcon = fontIconsMap[font]
        const className = styles.button + " " + (activeFont === font ? styles.active : "")
        const dispatchFont = () => dispatchOption<Action, Font>("clickedFont", font)
        return <button key={font} className={className} onClick={dispatchFont} >{fontIcon}</button>
    }


    return (
        <ToolOptionsContainer>
            <ColorsOptions activeColor={activeColor} dispatch={dispatchOption}/>
            <StickyNoteButton/>
            {FontButton("draw")}
            {FontButton("sans")}
            {FontButton("serif")}
        </ToolOptionsContainer>
    )
}