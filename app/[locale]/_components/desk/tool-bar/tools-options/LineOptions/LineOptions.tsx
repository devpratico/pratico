import styles from './LineOptions.module.css'
import HighlighterIcon from '@/app/[locale]/_components/icons/HighlighterIcon';
import PencilStrokeIcon from '@/app/[locale]/_components/icons/PencilStrokeIcon';
import PencilDashIcon from '@/app/[locale]/_components/icons/PencilDashIcon';
import LaserIcon from '@/app/[locale]/_components/icons/LaserIcon';
import { ToolBarState } from '@/app/_utils/tldraw/toolBarState';

type Action = "clickedSize" | "clickedDash" | "clickedTool";
export type Size   = "s" | "m" | "l" | "xl";
export type Dash   = "solid" | "dotted";
export type Tool = "draw" | "highlight" | "laser";

interface LineOptionsProps {
    state: ToolBarState["drawOptions"];
    dispatch?: (action: string, payload: string) => void;
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
        dispatch && dispatch("CLICK_DRAW_SIZE", size);
    };

    return ([
            <SizeBtn size="s"  key={"s"}  active={state.size === "s"}      onClick={() => handleSizeClick("s")}/>,
            <SizeBtn size="m"  key={"m"}  active={state.size === "m"}      onClick={() => handleSizeClick("m")}/>,
            <SizeBtn size="l"  key={"l"}  active={state.size === "l"}      onClick={() => handleSizeClick("l")}/>,
            <SizeBtn size="xl" key={"xl"} active={state.size === "xl"}    onClick={() => handleSizeClick("xl")}/>,
            <SolidLineBtn      key={"solid"} active={state.type == "normal"} onClick={dispatch ? () => dispatch("CLICK_DRAW_TYPE", "solid") : undefined}/>,
            <DashBtn           key={"dotted"} active={state.type == "dotted"}  onClick={dispatch ? () => dispatch("CLICK_DRAW_TYPE", "dotted") : undefined}/>,
            <HighlighterBtn    key={"highlight"} active={state.type == "highlight"} onClick={dispatch ? () => dispatch("CLICK_DRAW_TYPE", "highlight") : undefined}/>,
            <LaserIconBtn      key={"laser"} active={state.type == "laser"}     onClick={dispatch ? () => dispatch("CLICK_DRAW_TYPE", "laser") : undefined}/>
        ]
    )
}