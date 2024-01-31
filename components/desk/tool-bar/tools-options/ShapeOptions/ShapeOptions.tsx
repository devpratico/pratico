import styles from "./ShapeOptions.module.css";
import ToolOptionsContainer from "../ToolOptionsContainer/ToolOptionsContainer";
import ColorsOptions from "../ColorsOptions/ColorsOptions";
import SquareIcon from "@/components/icons/SquareIcon";
import CircleIcon from "@/components/icons/CircleIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import StarIcon from "@/components/icons/StarIcon";
import TransparentShapesIcon from "@/components/icons/TransparentShapesIcon";
import SemiFilledShapesIcon from "@/components/icons/SemiFilledShapesIcon";
import EmptyDottedShapesIcon from "@/components/icons/EmptyDottedShapesIcon";
import ShapesIcon from "@/components/icons/ShapesIcon";
import { ToolBarState } from "@/utils/tldraw/toolBarState";


export type Shape = ToolBarState["shapeOptions"]["shape"];
export type Style = ToolBarState["shapeOptions"]["style"];

interface ShapeOptionsProps {
    state: ToolBarState["shapeOptions"];
    dispatch?: (action: string, payload: string) => void;
}

export default function ShapeOptions({state, dispatch}: ShapeOptionsProps) {

    const dispatchShape = (shape: Shape) => {
        dispatch && dispatch("CLICK_OPTION", "shape")
        dispatch && dispatch("CLICK_SHAPE_TYPE", shape)
    }

    const dispatchStyle = (style: Style) => {
        dispatch && dispatch("CLICK_OPTION", "shape")
        dispatch && dispatch("CLICK_SHAPE_STYLE", style)
    }

    return(
        <ToolOptionsContainer>
            
            {ColorsOptions({activeColor: state.color, dispatch: dispatch || (()=>{})})}

            <button key="rectangle" className={styles.optionBtn + (state.shape === "rectangle" ? " " + styles.active : "")} onClick={()=>dispatchShape("rectangle")}>
                <SquareIcon fill={state.shape === "rectangle"} />
            </button>

            <button key="ellipse" className={styles.optionBtn + (state.shape === "ellipse" ? " " + styles.active : "")} onClick={()=>dispatchShape("ellipse")}>
                <CircleIcon fill={state.shape === "ellipse"} />
            </button>

            <button key="arrow" className={styles.optionBtn + (state.shape === "arrow" ? " " + styles.active : "")} onClick={()=>dispatchShape("arrow")}>
                <ArrowRightIcon fill={state.shape === "arrow"} />
            </button>

            <button key="star" className={styles.optionBtn + (state.shape === "star" ? " " + styles.active : "")} onClick={()=>dispatchShape("star")}>
                <StarIcon fill={state.shape === "star"} />
            </button>

            <button key="empty" className={styles.optionBtn + (state.style == "empty" ? " " + styles.active : "")} onClick={()=>dispatchStyle("empty")}>
                <TransparentShapesIcon/>
            </button>

            <button key="white" className={styles.optionBtn + (state.style == "whiteFilled" ? " " + styles.active : "")} onClick={()=>dispatchStyle("whiteFilled")}>
                <ShapesIcon fill={false}/>
            </button>

            <button key="fill" className={styles.optionBtn + (state.style == "colorFilled" ? " " + styles.active : "")} onClick={()=>dispatchStyle("colorFilled")}>
                <SemiFilledShapesIcon/>
            </button>

            <button key="dot" className={styles.optionBtn + (state.style == "dotted" ? " " + styles.active : "")} onClick={()=>dispatchStyle("dotted")}>
                <EmptyDottedShapesIcon/>
            </button>

        </ToolOptionsContainer>
    )   
}

