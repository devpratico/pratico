import styles from './LineOptions.module.css'
import Image from 'next/image';
import sLine from 'public/icons/s-line.svg'
import mLine from 'public/icons/m-line.svg'
import lLine from 'public/icons/l-line.svg'
import dashLine from 'public/icons/dash-line.svg'

type Action = "clickedSize" | "clickedDash";
export type Size   = "s" | "m" | "l" | "xl";
export type Dash   = "solid" | "dashed";

interface LineOptionsProps {
    activeSize: Size;
    activeDash: Dash;
    dispatch?: <A,P>(action: A, payload: P) => void;
}


/**
 * A button to pick a line size
 */
function SizeBtn({size, active, onClick}: {size: Size, active: boolean, onClick?: () => void}) {
    // Pick the right icon
    const SizeIcon = ({size}: {size: Size}) => {
        const width = 12;
        switch (size) {
            case "s" : return <Image src={sLine} alt="s-line" width={width}/>
            case "m" : return <Image src={mLine} alt="m-line" width={width}/>
            case "xl": return <Image src={lLine} alt="l-line" width={width}/>
            default  : return <Image src={lLine} alt="l-line" width={width}/>
        }
    }
    return (
        <button className={styles.sizePick + (active ? " " + styles.active : "")} onClick={onClick}>
            <SizeIcon size={size}/>
        </button>
    )
}

/**
 * A button to pick a line dash style
 * it is set up to accept several dash styles, but only one is implemented
 */
function DashBtn({dash, active, onClick}: {dash: Dash, active: boolean, onClick?: () => void}) {
    return (
        <button className={styles.dashPick + (active ? " " + styles.active : "")} onClick={onClick}>
            <Image src={dashLine} alt="dash-line" width={12}/>
        </button>
    )
}

export default function LineOptions({activeSize, activeDash, dispatch}: LineOptionsProps) {
    return (
        <div className={styles.container}>
            <SizeBtn size="s"  active={activeSize === "s"}  onClick={dispatch ? () => dispatch<Action, Size>("clickedSize", "s")  : undefined}/>
            <SizeBtn size="m"  active={activeSize === "m"}  onClick={dispatch ? () => dispatch<Action, Size>("clickedSize", "m")  : undefined}/>
            <SizeBtn size="xl" active={activeSize === "xl"} onClick={dispatch ? () => dispatch<Action, Size>("clickedSize", "xl") : undefined}/>
            <DashBtn dash="dashed" active={activeDash === "dashed"} onClick={dispatch ? () => dispatch<Action, Dash>("clickedDash", "dashed") : undefined}/>
        </div>
    )
}