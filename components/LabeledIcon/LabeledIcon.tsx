import React from 'react';
import styles from './LabeledIcon.module.css';
import {getIcon, IconName} from '../../utils/Icons';
import { ColorType } from '../../utils/Colors';
import { IconSize } from '../../utils/Icons';


export interface LabeledIconProps {
    type: IconName
    label?: string;
    hideLabel?: boolean;
    iconColor?: ColorType;
    labelColor?: ColorType;
    size?: IconSize;
    /**
     * If true, the center of the element will be set to the center of the icon.
     */
    centered?: boolean;
}

export default function LabeledIcon({ type, label, hideLabel, iconColor, labelColor, size, centered }: LabeledIconProps) {
    let icon = getIcon(type);

    if (size) {
        icon = React.cloneElement(icon, { size });
    }

    // Css classes with the same name as the color exist in the globals.css file
    const iconColorClass =  iconColor  ? iconColor  : "";
    const labelColorClass = labelColor ? labelColor : "";

    return (
        <div className={styles.container}>

            {/* The invisible label is used to set the center of the element to the center of the icon */}
            {(label && hideLabel != true && centered) ? <p className={`${styles.label} ${styles.invisible}`}>{label}</p> : null}

            <div className={iconColorClass}>
                {icon}
            </div>

            {(label && hideLabel != true) ? <p className={`${styles.label} ${labelColorClass}`}>{label}</p> : null}
        </div>
    )
}


