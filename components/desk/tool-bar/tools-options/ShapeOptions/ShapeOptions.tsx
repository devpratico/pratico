import styles from "./ShapeOptions.module.css";
import ToolOptionsContainer from "../ToolOptionsContainer/ToolOptionsContainer";
import ColorsOptions, {Color} from "../ColorsOptions/ColorsOptions";
import SquareIcon from "@/components/icons/SquareIcon";
import CircleIcon from "@/components/icons/CircleIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import StarIcon from "@/components/icons/StarIcon";
import TransparentShapesIcon from "@/components/icons/TransparentShapesIcon";
import SemiFilledShapesIcon from "@/components/icons/SemiFilledShapesIcon";
import EmptyDottedShapesIcon from "@/components/icons/EmptyDottedShapesIcon";
import ShapesIcon from "@/components/icons/ShapesIcon";
import { ToolBarState } from "@/utils/tldraw/toolBarState";


export type Shape = "rectangle" | "ellipse" | "arrow" | "star";
export type Style = "emptySolid" | "fillSolid" | "emptyDotted" | "whiteSolid";

interface ShapeOptionsProps {
    state: ToolBarState["shapeOptions"];
    dispatch?: <A,P>(action: A, payload: P) => void;
}

export default function ShapeOptions({state, dispatch}: ShapeOptionsProps) {

    const dispatchShape = (shape: Shape) => {
        dispatch && dispatch<string, string>("clickedOption", "shape")
        dispatch && dispatch<string, Shape>("clickedShape", shape)
    }

    const dispatchStyle = (style: Style) => {
        dispatch && dispatch<string, string>("clickedOption", "shape")
        dispatch && dispatch<string, Style>("clickedStyle", style)
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

            <button key="arrow" className={styles.optionBtn + (state.shape === "arrow" ? " " + styles.active : "")} onClick={()=>dispatch && dispatch<string, string>("clickedTool", "arrow")}>
                <ArrowRightIcon fill={state.shape === "arrow"} />
            </button>

            <button key="star" className={styles.optionBtn + (state.shape === "star" ? " " + styles.active : "")} onClick={()=>dispatchShape("star")}>
                <StarIcon fill={state.shape === "star"} />
            </button>

            <button key="empty" className={styles.optionBtn + (state.style == "empty" ? " " + styles.active : "")} onClick={()=>dispatchStyle("emptySolid")}>
                <TransparentShapesIcon/>
            </button>

            <button key="white" className={styles.optionBtn + (state.style == "whiteFilled" ? " " + styles.active : "")} onClick={()=>dispatchStyle("whiteSolid")}>
                <ShapesIcon fill={false}/>
            </button>

            <button key="fill" className={styles.optionBtn + (state.style == "colorFilled" ? " " + styles.active : "")} onClick={()=>dispatchStyle("fillSolid")}>
                <SemiFilledShapesIcon/>
            </button>

            <button key="dot" className={styles.optionBtn + (state.style == "dotted" ? " " + styles.active : "")} onClick={()=>dispatchStyle("emptyDotted")}>
                <EmptyDottedShapesIcon/>
            </button>

        </ToolOptionsContainer>
    )   
}

