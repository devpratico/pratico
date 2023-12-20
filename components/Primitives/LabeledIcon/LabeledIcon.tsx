import React from 'react';
import styles from './LabeledIcon.module.css';
import {getIcon, IconName} from '../../../utils/Icons';
import { IconSize } from '../../../utils/Icons';


export interface LabeledIconProps {
    type: IconName
    label?: string;
    hideLabel?: boolean;
    iconColor?: string;
    labelColor?: string;
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

    return (
        <div className={styles.container}>

            {/* The invisible label is used to set the center of the element to the center of the icon */}
            {(label && hideLabel != true && centered) ? <p className={`${styles.label} ${styles.invisible}`}>{label}</p> : null}

            <div style={{ color: iconColor }}>
                {icon}
            </div>

            {(label && hideLabel != true) ? <p className={styles.label} style={{ color: labelColor }}>{label}</p> : null}
        </div>
    )
}


