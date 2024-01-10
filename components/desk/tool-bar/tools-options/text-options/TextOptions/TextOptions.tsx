import ToolOptionsContainer from "../../ToolOptionsContainer/ToolOptionsContainer";
import ColorsOptions, { Color } from "../../ColorsOptions/ColorsOptions";
import styles from "./TextOptions.module.css";
import { getIcon } from "@/utils/Icons";


type Action = "clickedTextOption";
type Option = "color";

interface TextOptionsProps {
    activeColor: Color;
    isStickyNote: boolean;
    alignText: "start" | "middle" | "end";
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function TextOptions({activeColor, isStickyNote, alignText, dispatch}: TextOptionsProps) {

    // We won't pass the original dispatch function.
    // We need to declare first that we come from the text tool.
    const dispatchColor = <A, P>(action: A, payload: P) => {
        dispatch<Action, Option>("clickedTextOption", "color")
        dispatch<A, P>(action, payload)
    }

    
    function StickyNoteButton() {
        const stickyNoteIcon = getIcon("sticky-note", "lg")
        const className = styles.button + " " + (isStickyNote ? styles.active : "")
        const dispatchStickyNote = () => dispatch<string, string>("clickedTextOption", "sticky-note")
        return <button className={className} onClick={dispatchStickyNote} >{stickyNoteIcon}</button>
    }

    function AlignLeftButton() {
        const alignLeftIcon = getIcon("align-left", "lg")
        const className = styles.button + " " + (alignText === "start" ? styles.active : "")
        const dispatchAlignLeft = () => dispatch<string, string>("clickedTextOption", "align-left")
        return <button className={className} onClick={dispatchAlignLeft}>{alignLeftIcon}</button>
    }

    function AlignCenterButton() {
        const alignCenterIcon = getIcon("align-center", "lg")
        const className = styles.button + " " + (alignText === "middle" ? styles.active : "")
        const dispatchAlignCenter = () => dispatch<string, string>("clickedTextOption", "align-center")
        return <button className={className} onClick={dispatchAlignCenter}>{alignCenterIcon}</button>
    }

    function AlignRightButton() {
        const alignRightIcon = getIcon("align-right", "lg")
        const className = styles.button + " " + (alignText === "end" ? styles.active : "")
        const dispatchAlignRight = () => dispatch<string, string>("clickedTextOption", "align-right")
        return <button className={className} onClick={dispatchAlignRight}>{alignRightIcon}</button>
    }


    return (
        <ToolOptionsContainer>
            <ColorsOptions activeColor={activeColor} dispatch={dispatchColor}/>
            <div className={styles.otherOptionsContainer}>
                <StickyNoteButton/>
                <AlignLeftButton/>
                <AlignCenterButton/>
                <AlignRightButton/>
            </div>
        </ToolOptionsContainer>
    )
}