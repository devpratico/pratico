import styles from './ColorsOptions.module.css'
import { DefaultColorStyle, DefaultColorThemePalette } from '@tldraw/tldraw';


const colors = DefaultColorStyle.values // Get colors from tldraw ("black", "red", etc.)
const colorValues = colors.map(color => DefaultColorThemePalette.lightMode[color].solid) // Get the hex value of each color
const colorsMap = Object.fromEntries(colors.map((color, i) => [color, colorValues[i]])) // Create a map of color names to hex values

type Action = "clickedColor";
export type Color  = typeof colors[number];

interface ColorsOptionsProps {
    activeColor: Color;
    dispatch: (action: string, payload: string) => void;
}

/**
 * This is not a component, but a function that returns an array of components.
 * To be used in a grid / flexbox.
 * It returns an array of circular buttons, each one with a different color.
 */
export default function ColorsOptions({activeColor, dispatch}: ColorsOptionsProps): JSX.Element[] {

    const ColorBtn = ({color, selected}: {color: Color, selected: boolean}) => {

        // Inline style
        const colorStyle = {
            //"--color": colorsMap[color]
            backgroundColor: colorsMap[color]
        } as React.CSSProperties

        return (
            <button
                className={styles.colorPick + " " + (selected ? styles.colorSelected : "")}
                onClick={() => dispatch("CLICK_COLOR", color)}
                style={colorStyle}
            />)
    }   

    return colors.map(color => <ColorBtn key={color} color={color} selected={activeColor === color}/>)
}