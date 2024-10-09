import ToolOptionsContainer from "../ToolOptionsContainer/ToolOptionsContainer";
import ColorsOptions, { Color } from "../ColorsOptions/ColorsOptions";
import styles from "./TextOptions.module.css";
import FontDrawIcon from "@/public/icons/FontDrawIcon";
import FontSerifIcon from "@/public/icons/FontSerifIcon";
import FontSansIcon from "@/public/icons/FontSansIcon";
import StickyIcon from "@/app/(frontend)/[locale]/_components/icons/StickyIcon";
import TextAreaIcon from "@/app/(frontend)/[locale]/_components/icons/TextAreaIcon";
import { ToolBarState } from "@/app/_utils/tldraw/toolBarState";


type Action = "clickedOption" | "clickedTool" | "clickedFont";
type Tool = "text" | "note";
export type Font = "draw" | "sans" | "serif" | "mono";

interface TextOptionsProps {
    state: ToolBarState["textOptions"];
    dispatch: (action: string, payload: string) => void;
}


export default function TextOptions({state, dispatch}: TextOptionsProps) {

    function StickyNoteButton() {
        //const stickyNoteIcon = <FontAwesomeIcon icon={faStickyNote} size="xl"/>;
        const stickyNoteIcon = <StickyIcon fill={state.type == "stickyNote"}/>
        const className = styles.button + " " + styles.double + " " +(state.type == "stickyNote" ? styles.active : "")
        const dispatchStickyNote = () => dispatch("CLICK_TEXT_TYPE", "stickyNote")
        return <button key={"note"} title={"Sticky note"} className={className} onClick={dispatchStickyNote} >{stickyNoteIcon}</button>
    }


    function TextAreaButton() {
        const textAreaIcon = <TextAreaIcon/>
        const className = styles.button + " " + styles.double + " " + (!(state.type == "stickyNote") ? styles.active : "")
        const dispatchTextArea = () => dispatch("CLICK_TEXT_TYPE", "normal")
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
        const dispatchFont = () => dispatch("CLICK_FONT", font)
        return <button key={font} title={`Font - ${font}`} className={className} onClick={dispatchFont} >{fontIcon}</button>
    }


    return (
        <ToolOptionsContainer>
            <ColorsOptions activeColor={state.color} dispatch={dispatch}/>
            {FontButton("draw")}
            {FontButton("sans")}
            {FontButton("serif")}
            {FontButton("mono")}
            <TextAreaButton/>
            <StickyNoteButton/>
        </ToolOptionsContainer>
    )
}