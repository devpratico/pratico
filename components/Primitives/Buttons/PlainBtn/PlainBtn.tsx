'use client'
import styles from './PlainBtn.module.css';
import { getIcon, IconName, IconSize } from '../../../../utils/Icons'

export type ThemeColors = "primary" | "secondary" | "red" | "green";

export interface PlainBtnProps {
    text: string;
    iconName?: IconName;
    size?: "s" | "m" | "l";
    style?: "solid" | "soft" | "outline" | "ghost";
    color?: ThemeColors;
    onClick?: () => void;
    enabled?: boolean;
}


export default function PlainBtn(props: PlainBtnProps) {

    // Set the icon
    let icon = null;
    if (props.iconName) {
        const iconSize = "lg" as IconSize;
        icon = getIcon(props.iconName, iconSize);
    }

    // Set the styles
    const stylesArray = [styles.container,"smallShadow"];

    switch (props.size) {
        case "s":
            stylesArray.push(styles.s);
            break;
        case "m":
            stylesArray.push(styles.m);
            break;
        case "l":
            stylesArray.push(styles.l);
            break;
        default:
            stylesArray.push(styles.m);
            break;
    }

    switch (props.style) {
        case "solid":
            stylesArray.push(styles.solid);
            break;
        case "soft":
            stylesArray.push(styles.soft);
            break;
        case "outline":
            stylesArray.push(styles.outline);
            break;
        case "ghost":
            stylesArray.push(styles.ghost);
            break;
        default:
            stylesArray.push(styles.solid);
            break;
    }

    switch (props.color) {
        case "primary":
            stylesArray.push(styles.primary);
            break;
        case "secondary":
            stylesArray.push(styles.secondary);
            break;
        case "red":
            stylesArray.push(styles.red);
            break;
        case "green":
            stylesArray.push(styles.green);
            break;
        default:
            stylesArray.push(styles.primary);
            break;
    }

    // Set the enabled state
    if (props.enabled === false) {
        stylesArray.push(styles.disabled);
    }

    const btnStyle = stylesArray.join(" ");


    return (
        <button className={btnStyle}>
            {icon}
            <p>{props.text}</p>
        </button>
    )
}