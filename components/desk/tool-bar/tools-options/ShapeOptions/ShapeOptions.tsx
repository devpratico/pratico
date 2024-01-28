import styles from "./ShapeOptions.module.css";
import ToolOptionsContainer from "../ToolOptionsContainer/ToolOptionsContainer";
import ColorsOptions, {Color} from "../ColorsOptions/ColorsOptions";
import SquareIcon from "@/components/icons/SquareIcon";
import CircleIcon from "@/components/icons/CircleIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import StarIcon from "@/components/icons/StarIcon";
import ShapeEmptyIcon from "@/components/icons/ShapeEmptyIcon";
import ShapeFillIcon from "@/components/icons/ShapeFillIcon";
import ShapeDashIcon from "@/components/icons/ShapeDashIcon";


export type Shape = "rectangle" | "ellipse" | "arrow" | "star";
export type Style = "emptySolid" | "fillSolid" | "emptyDotted";

interface ShapeOptionsProps {
    activeColor: Color;
    activeShape: Shape;
    activeStyle: Style;
    dispatch?: <A,P>(action: A, payload: P) => void;
}

export default function ShapeOptions({activeColor, activeShape, activeStyle, dispatch}: ShapeOptionsProps) {

    const dispatchShape = (shape: Shape) => {
        dispatch && dispatch<string, string>("clickedOption", "shape")
        dispatch && dispatch<string, string>("clickedShape", shape)
    }

    const dispatchStyle = (style: Style) => {
        dispatch && dispatch<string, string>("clickedOption", "shape")
        dispatch && dispatch<string, string>("clickedStyle", style)
    }

    return(
        <ToolOptionsContainer>
            
            {ColorsOptions({activeColor, dispatch: dispatch || (()=>{})})}

            <button key="rectangle" className={styles.optionBtn + (activeShape === "rectangle" ? " " + styles.active : "")} onClick={()=>dispatchShape("rectangle")}>
                <SquareIcon fill={activeShape === "rectangle"} />
            </button>

            <button key="ellipse" className={styles.optionBtn + (activeShape === "ellipse" ? " " + styles.active : "")} onClick={()=>dispatchShape("ellipse")}>
                <CircleIcon fill={activeShape === "ellipse"} />
            </button>

            <button key="arrow" className={styles.optionBtn + (activeShape === "arrow" ? " " + styles.active : "")} onClick={()=>dispatch && dispatch<string, string>("clickedTool", "arrow")}>
                <ArrowRightIcon fill={activeShape === "arrow"} />
            </button>

            <button key="star" className={styles.optionBtn + (activeShape === "star" ? " " + styles.active : "")} onClick={()=>dispatchShape("star")}>
                <StarIcon fill={activeShape === "star"} />
            </button>

            <button key="empty" className={styles.optionBtn + (activeStyle == "emptySolid" ? " " + styles.active : "")} onClick={()=>dispatchStyle("emptySolid")}>
                <ShapeEmptyIcon/>
            </button>

            <button key="fill" className={styles.optionBtn + (activeStyle == "fillSolid" ? " " + styles.active : "")} onClick={()=>dispatchStyle("fillSolid")}>
                <ShapeFillIcon/>
            </button>

            <button key="dot" className={styles.optionBtn + (activeStyle == "emptyDotted" ? " " + styles.active : "")} onClick={()=>dispatchStyle("emptyDotted")}>
                <ShapeDashIcon/>
            </button>

        </ToolOptionsContainer>
    )   
}

