import styles from './LineOptions.module.css'
import HighlighterIcon from '@/components/icons/HighlighterIcon';
import PencilStrokeIcon from '@/components/icons/PencilStrokeIcon';
import PencilDashIcon from '@/components/icons/PencilDashIcon';
import LaserIcon from '@/components/icons/LaserIcon';
import { ToolBarState } from '@/utils/tldraw/toolBarState';

type Action = "clickedSize" | "clickedDash" | "clickedTool";
export type Size   = "s" | "m" | "l" | "xl";
export type Dash   = "solid" | "dotted";
export type Tool = "draw" | "highlight" | "laser";

interface LineOptionsProps {
    state: ToolBarState["drawOptions"];
    dispatch?: <A,P>(action: A, payload: P) => void;
}


/**
 * The button wrap for options Icons. Provides the hover and active style
 */
function OptionBtn({children, active, onClick}: {children: JSX.Element, active: boolean, onClick?: () => void}) {
    return (
        <button className={styles.optionBtn + (active ? " " + styles.btnActive : "")} onClick={onClick}>
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
            <PencilDashIcon fill={active} size="md"/>
        </OptionBtn>
    )
}


function SolidLineBtn({active, onClick}: {active: boolean, onClick?: () => void}) {
    return (
        <OptionBtn active={active} onClick={onClick}>
            <PencilStrokeIcon fill={active} size="md"/>
        </OptionBtn>
    )
}

function HighlighterBtn({active, onClick}: {active: boolean, onClick?: () => void}) {
    return (
        <OptionBtn active={active} onClick={onClick}>
            <HighlighterIcon fill={active} size="md"/>
        </OptionBtn>
    )
}

function LaserIconBtn({active, onClick}: {active: boolean, onClick?: () => void}) {
    return (
        <OptionBtn active={active} onClick={onClick}>
            <LaserIcon size="md"/>
        </OptionBtn>
    )
}


export default function LineOptions({state, dispatch}: LineOptionsProps): JSX.Element[] {

    const handleSizeClick = (size: Size) => {
        console.log(`Size clicked: ${size}`);
        dispatch && dispatch<Action, Size>("clickedSize", size);
    };

    return ([
            <SizeBtn size="s"  key={"s"}  active={state.size === "s"}      onClick={() => handleSizeClick("s")}/>,
            <SizeBtn size="m"  key={"m"}  active={state.size === "m"}      onClick={() => handleSizeClick("m")}/>,
            <SizeBtn size="l"  key={"l"}  active={state.size === "l"}      onClick={() => handleSizeClick("l")}/>,
            <SizeBtn size="xl" key={"xl"} active={state.size === "xl"}    onClick={() => handleSizeClick("xl")}/>,
            <SolidLineBtn      key={"solid"} active={state.type == "normal"} onClick={dispatch ? () => dispatch<Action, Dash>("clickedDash", "solid") : undefined}/>,
            <DashBtn           key={"dotted"} active={state.type == "dotted"}  onClick={dispatch ? () => dispatch<Action, Dash>("clickedDash", "dotted") : undefined}/>,
            <HighlighterBtn    key={"highlight"} active={state.type == "highlight"} onClick={dispatch ? () => dispatch<Action, Tool>("clickedTool", "highlight") : undefined}/>,
            <LaserIconBtn      key={"laser"} active={state.type == "laser"}     onClick={dispatch ? () => dispatch<Action, Tool>("clickedTool", "laser") : undefined}/>
        ]
    )
}