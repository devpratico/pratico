import styles from './LineOptions.module.css'
import { getIcon } from '@/utils/Icons';
import DashLineIcon from '@/public/icons/DashLineIcon';
import SolidLineIcon from '@/public/icons/SolidLineIcon';
import LaserIcon from '@/public/icons/LaserIcon';

type Action = "clickedSize" | "clickedDash" | "clickedTool";
export type Size   = "s" | "m" | "l" | "xl";
export type Dash   = "solid" | "dashed";
export type Tool = "highlighter" | "laser";

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
    return ([
            <SizeBtn size="s"  active={activeSize === "s"}      onClick={dispatch ? () => dispatch<Action, Size>("clickedSize", "s")  : undefined}/>,
            <SizeBtn size="m"  active={activeSize === "m"}      onClick={dispatch ? () => dispatch<Action, Size>("clickedSize", "m")  : undefined}/>,
            <SizeBtn size="l"  active={activeSize === "l"}      onClick={dispatch ? () => dispatch<Action, Size>("clickedSize", "l")  : undefined}/>,
            <SizeBtn size="xl" active={activeSize === "xl"}     onClick={dispatch ? () => dispatch<Action, Size>("clickedSize", "xl") : undefined}/>,
            <SolidLineBtn      active={activeDash === "solid"}  onClick={dispatch ? () => dispatch<Action, Dash>("clickedDash", "solid") : undefined}/>,
            <DashBtn           active={activeDash === "dashed"} onClick={dispatch ? () => dispatch<Action, Dash>("clickedDash", "dashed") : undefined}/>,
            <HighlighterBtn    active={activeTool === "highlighter"} onClick={dispatch ? () => dispatch<Action, Tool>("clickedTool", "highlighter") : undefined}/>,
            <LaserIconBtn      active={activeTool === "laser"}       onClick={dispatch ? () => dispatch<Action, Tool>("clickedTool", "laser") : undefined}/>
        ]
    )
}