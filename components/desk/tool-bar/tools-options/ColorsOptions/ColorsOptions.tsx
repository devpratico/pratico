import styles from './ColorsOptions.module.css'

type Action = "clickColor";
type Color  = "black" | "blue" | "green" | "red";
export type ColorDispatch = {action: Action, payload: Color};

interface ColorsOptionsProps {
    activeColor: string;
    //setColor: (color: string) => void;
    dispatch: (_: ColorDispatch) => void;
}

export default function ColorsOptions({activeColor, dispatch}: ColorsOptionsProps) {

    const ColorBtn = ({color, selected}: {color: Color, selected: boolean}) => (
        <button
            className={styles.colorPick + " " + styles[color] + " " + (selected ? styles.colorSelected : "")}
            onClick={() => dispatch({action: "clickColor", payload: color})}
        />
    )

    return (
        <div className={styles.container}>
            <ColorBtn color="black" selected={activeColor === "black"}/>
            <ColorBtn color="blue"  selected={activeColor === "blue"}/>
            <ColorBtn color="green" selected={activeColor === "green"}/>
            <ColorBtn color="red"   selected={activeColor === "red"}/>
        </div>
    )
}