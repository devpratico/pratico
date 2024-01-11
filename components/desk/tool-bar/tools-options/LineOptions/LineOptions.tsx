import styles from './LineOptions.module.css'
import { getIcon } from '@/utils/Icons';
import DashLineIcon from '@/public/icons/DashLineIcon';
import SolidLineIcon from '@/public/icons/SolidLineIcon';
import LaserIcon from '@/public/icons/LaserIcon';

type Action = "clickedSize" | "clickedDash" | "clickedTool";
export type Size   = "s" | "m" | "l" | "xl";
export type Dash   = "solid" | "dashed";
export type Tool = "draw" | "highlight" | "laser";

interface LineOptionsProps {
    activeSize: Size;
    activeDash: Dash;
    activeTool: Tool;
    dispatch?: <A,P>(action: A, payload: P) => void;
}


/**
 * The button wrap for options Icons. Provides the hover and active style
 */
function OptionBtn({children, active, onClick}: {children: JSX.Element, active: boolean, onClick?: () => void}) {
    return (
        <button className={styles.optionBtn + (active ? " " + styles.active : "")} onClick={onClick}>
            {children}
        </button>
    )
}


/**
 * A button to pick a line size
 */
function SizeBtn({size, active, onClick}: {size: Size, active: boolean, onClick?: () => void}) {
    return (
        <OptionBtn active={active} onClick={onClick}>
            <div className={styles.sizeDisk + " " + styles[size]}/>
        </OptionBtn>
    )
}

/**
 * Dotted line button
 */
function DashBtn({active, onClick}: {active: boolean, onClick?: () => void}) {
    return (
        <OptionBtn active={active} onClick={onClick}>
            <DashLineIcon/>
        </OptionBtn>
    )
}


function SolidLineBtn({active, onClick}: {active: boolean, onClick?: () => void}) {
    return (
        <OptionBtn active={active} onClick={onClick}>
            <SolidLineIcon/>
        </OptionBtn>
    )
}

function HighlighterBtn({active, onClick}: {active: boolean, onClick?: () => void}) {
    return (
        <OptionBtn active={active} onClick={onClick}>
            {getIcon("highlighter", "lg")}
        </OptionBtn>
    )
}

function LaserIconBtn({active, onClick}: {active: boolean, onClick?: () => void}) {
    return (
        <OptionBtn active={active} onClick={onClick}>
            <LaserIcon/>
        </OptionBtn>
    )
}


export default function LineOptions({activeSize, activeDash, activeTool, dispatch}: LineOptionsProps): JSX.Element[] {

    const handleSizeClick = (size: Size) => {
        console.log(`Size clicked: ${size}`);
        dispatch && dispatch<Action, Size>("clickedSize", size);
    };

    return ([
            <SizeBtn size="s"  key={"s"} active={activeSize === "s"}      onClick={() => handleSizeClick("s")}/>,
            <SizeBtn size="m"  key={"m"} active={activeSize === "m"}      onClick={() => handleSizeClick("m")}/>,
            <SizeBtn size="l"  key={"l"} active={activeSize === "l"}      onClick={() => handleSizeClick("l")}/>,
            <SizeBtn size="xl" key={"exl"} active={activeSize === "xl"}   onClick={() => handleSizeClick("xl")}/>,
            <SolidLineBtn      key={"solid"} active={activeDash === "solid"  && activeTool=="draw" } onClick={dispatch ? () => dispatch<Action, Dash>("clickedDash", "solid") : undefined}/>,
            <DashBtn           key={"dash"} active={activeDash === "dashed" && activeTool=="draw"}  onClick={dispatch ? () => dispatch<Action, Dash>("clickedDash", "dashed") : undefined}/>,
            <HighlighterBtn    key={"highlight"} active={activeTool === "highlight"} onClick={dispatch ? () => dispatch<Action, Tool>("clickedTool", "highlight") : undefined}/>,
            <LaserIconBtn      key={"laser"} active={activeTool === "laser"}     onClick={dispatch ? () => dispatch<Action, Tool>("clickedTool", "laser") : undefined}/>
        ]
    )
}