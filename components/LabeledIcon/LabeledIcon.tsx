import React from 'react';
import styles from './LabeledIcon.module.css';
import {getIcon, IconName} from '../../utils/Icons';
import { ColorType } from '@/utils/Colors';
import { IconSize } from '@/utils/Icons';


interface IconProps {
    type: IconName
    label?: string;
    iconColor?: ColorType;
    labelColor?: ColorType;
    size?: IconSize;
}

export default function LabeledIcon({ type, label, iconColor, labelColor, size }: IconProps) {
    let icon = getIcon(type);

    if (size) {
        icon = React.cloneElement(icon, { size });
    }

    // Css classes with the same name as the color exist in the globals.css file
    const iconColorClass =  iconColor  ? iconColor  : "";
    const labelColorClass = labelColor ? labelColor : "";

    return (
        <div className={styles.container}>
            <div className={iconColorClass}>
                {icon}
            </div>

            {label ? <p className={`${styles.label} ${labelColorClass}`}>{label}</p> : null}
        </div>
    )
}


