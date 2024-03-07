'use client'
import React from 'react';
import styles from './PlainBtn.module.css';

//export type ThemeColors = "primary" | "secondary" | "red" | "green";

export interface PlainBtnProps {
    children?: JSX.Element;
    message?: string;
    //icon?: JSX.Element;
    size?: "s" | "m" | "l";
    style?: "solid" | "soft" | "outline" | "ghost";
    color?: "primary" | "secondary" | "background" | "red" | "green";
    onClick?: () => void;
    enabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

// TODO: Make it take children instead of props (in a flex with gap)
export default function PlainBtn({
    children,
    message,
    //icon,
    size="m",
    style="solid",
    color="primary",
    onClick=() => {},
    enabled=true,
    type="button",
    className
}: PlainBtnProps) {
    
    // Set the styles
    const stylesArray = [
        styles.container,
        styles[size],
        styles[color],
        styles[style]
    ];
    if (className) stylesArray.push(className);
    if (enabled === false) stylesArray.push(styles.disabled)
    const btnStyle = stylesArray.join(" ");

    //const _icon = icon && React.cloneElement(icon, {className: styles.icon})
    const _icon = children && React.cloneElement(children, {className: styles.icon})
    
    return (
        <button className={btnStyle} onClick={onClick} type={type} disabled={enabled === false}>
            {_icon}
            <p className={styles.text}>{message}</p>
        </button>
    )
}