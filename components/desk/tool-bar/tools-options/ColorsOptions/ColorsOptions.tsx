import styles from './ColorsOptions.module.css'

type Action = "clickedColor";
export type Color  = "black" | "blue" | "green" | "red";

interface ColorsOptionsProps {
    activeColor: Color;
    dispatch: <A,P>(action: A, payload: P) => void;
}

export default function ColorsOptions({activeColor, dispatch}: ColorsOptionsProps) {

    const ColorBtn = ({color, selected}: {color: Color, selected: boolean}) => (
        <button
            className={styles.colorPick + " " + styles[color] + " " + (selected ? styles.colorSelected : "")}
            onClick={() => dispatch<Action, Color>("clickedColor", color)}
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