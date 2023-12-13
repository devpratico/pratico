import styles from './PlainBtn.module.css';
import { getIcon, IconName, IconSize } from '@/utils/Icons';



export interface PlainBtnProps {
    text: string;
    size?: "s" | "m" | "l";
    enabled?: boolean;
    iconName?: IconName;
    style?: "violet" | "white" | "translucent" | "transparent" | "orange" | "pink";
    onClick?: () => void;
}


export default function PlainBtn(props: PlainBtnProps) {

    // Set the icon
    let icon = null;
    if (props.iconName) {
        const iconSize = "lg" as IconSize;
        icon = getIcon(props.iconName, iconSize);
    }

    // Set the style
    let btnStyle = styles.container;
    switch (props.style) {
        case "violet":
            btnStyle = btnStyle.concat(" ", styles.btnViolet);
            break;
        case "white":
            btnStyle = btnStyle.concat(" ", styles.btnWhite);
            break;
        case "translucent":
            btnStyle = btnStyle.concat(" ", styles.btnTranslucent);
            break;
        case "transparent":
            btnStyle = btnStyle.concat(" ", styles.btnTransparent);
            break;
        case "orange":
            btnStyle = btnStyle.concat(" ", styles.btnOrange);
            break;
        case "pink":
            btnStyle = btnStyle.concat(" ", styles.btnPink);
            break;
        default:
            btnStyle = btnStyle.concat(" ", styles.btnViolet);
            break;
    }

    // Set the size
    const size = props.size ? props.size : "m";
    switch (size) {
        case "s":
            btnStyle = btnStyle.concat(" ", styles.btnSmall);
            break;
        case "m":
            btnStyle = btnStyle.concat(" ", styles.btnMedium);
            break;
        case "l":
            btnStyle = btnStyle.concat(" ", styles.btnLarge);
            break;
        default:
            btnStyle = btnStyle.concat(" ", styles.btnMedium);
            break;
    }

    // Set the enabled state
    if (props.enabled === false) {
        btnStyle = btnStyle.concat(" ", styles.disabled);
    }


    return (
        <button className={btnStyle}>
            {icon}
            <p>{props.text}</p>
        </button>
    )
}