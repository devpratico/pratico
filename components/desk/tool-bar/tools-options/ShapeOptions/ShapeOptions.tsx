import styles from "./ShapeOptions.module.css";
import { FontAwesomeSvg } from "@/utils/Icons";
import { faSquare, faCircle, faArrowRight, faStar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import ToolOptionsContainer from "../ToolOptionsContainer/ToolOptionsContainer";
import ColorsOptions, {Color} from "../ColorsOptions/ColorsOptions";


export type Shape = "rectangle" | "ellipse" | "arrow" | "star";

interface ShapeOptionsProps {
    activeColor: Color;
    activeShape: Shape;
    dispatch?: <A,P>(action: A, payload: P) => void;
}

export default function ShapeOptions({activeColor, activeShape, dispatch}: ShapeOptionsProps) {

    const dispatchShape = (shape: Shape) => {
        dispatch && dispatch<string, string>("clickedTool", "geo")
        dispatch && dispatch<string, string>("clickedShape", shape)
    }

    return(
        <ToolOptionsContainer>
            
            {ColorsOptions({activeColor, dispatch: dispatch || (()=>{})})}

            <button key="rectangle" className={styles.optionBtn + (activeShape === "rectangle" ? " " + styles.active : "")} onClick={()=>dispatchShape("rectangle")}>
                <FontAwesomeSvg icon={faSquare} className={styles.optionIcon}/>
            </button>

            <button key="ellipse" className={styles.optionBtn + (activeShape === "ellipse" ? " " + styles.active : "")} onClick={()=>dispatchShape("ellipse")}>
                <FontAwesomeSvg icon={faCircle} className={styles.optionIcon}/>
            </button>

            <button key="arrow" className={styles.optionBtn + (activeShape === "arrow" ? " " + styles.active : "")} onClick={()=>dispatch && dispatch<string, string>("clickedTool", "arrow")}>
                <FontAwesomeSvg icon={faArrowRight} className={styles.optionIcon}/>
            </button>

            <button key="star" className={styles.optionBtn + (activeShape === "star" ? " " + styles.active : "")} onClick={()=>dispatchShape("star")}>
                <FontAwesomeSvg icon={faStar} className={styles.optionIcon}/>
            </button>

        </ToolOptionsContainer>
    )   
}

