import React from 'react';
import styles from './LabeledIcon.module.css';
import { IconSize, iconSizeMap } from '@/utils/icons/IconProps';


export interface LabeledIconProps {
    icon: JSX.Element;

    iconSize: IconSize;

    label?: string;

    /**
     * The maximum width of the label.
     * @example "2rem", "100px"
     */
    labelMaxWidth?: string;

    hideLabel?: boolean;

    iconColor?: string;

    labelColor?: string;

    /**
     * If true, the center of the element will be set to the center of the icon.
     */
    centered?: boolean;

    className?: string;

    /**
     * The gap between the icon and the label.
     * @default "0.3rem"
     * @example "1rem", "2px"
     */
    gap?: string;
}



export default function LabeledIcon({
        icon,
        iconSize,
        label,
        labelMaxWidth,
        hideLabel=false,
        iconColor,
        labelColor,
        centered=false,
        className,
        gap="10%"
    }: LabeledIconProps) {

    const containerClasses = [styles.container]
    if (className) containerClasses.push(className)
    const containerClassNames = containerClasses.join(' ')
    const containerSizeStyle = { width: iconSizeMap[iconSize] }

    // Set the icon container size and color (will affect the icon)
    const iconSizeStyle  = iconSize  ? { width: iconSizeMap[iconSize], height: iconSizeMap[iconSize] } : {}
    const iconColorStyle = iconColor ? { color: iconColor } : {}
    const iconStyles = { ...iconSizeStyle, ...iconColorStyle }

    // Set the label color, size and gap
    const defaultLabelMaxWidth = `calc(3 * ${iconSizeMap[iconSize]})`
    const labelSizeStyle  = labelMaxWidth ? { maxWidth: labelMaxWidth } : { maxWidth: defaultLabelMaxWidth }
    const labelColorStyle = labelColor ? { color: labelColor } : {}
    const labelMarginStyle = { marginTop: gap }
    const labelStyles = { ...labelColorStyle, ...labelSizeStyle, ...labelMarginStyle }

    // Set the ghost label size and gap
    const ghostLabelMarginStyle = { marginBottom: gap }
    const ghostLabelStyles = { ...labelSizeStyle, ...ghostLabelMarginStyle }

    return (
        <div className={containerClassNames} style={containerSizeStyle}>

            {/* This invisible label is used to create a symmetry when centered set to true */}
            {(label && !hideLabel && centered) ?
                <p className={styles.ghostLabel} style={ghostLabelStyles}>{label}</p>
                : null
            }

            <div style={iconStyles}>
                {icon}
            </div>

            {(label && !hideLabel) ?
                <p className={styles.label} style={labelStyles}>{label}</p>
                : null
            }

        </div>
    )
}