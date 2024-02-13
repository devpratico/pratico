'use client'
import React from 'react';
import styles from './PlainBtn.module.css';

//export type ThemeColors = "primary" | "secondary" | "red" | "green";

export interface PlainBtnProps {
    children: React.ReactNode;
    icon?: JSX.Element;
    size?: "s" | "m" | "l";
    style?: "solid" | "soft" | "outline" | "ghost";
    color?: "primary" | "secondary" | "red" | "green";
    onClick?: () => void;
    enabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}


export default function PlainBtn({
    children,
    icon,
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

    const _icon = icon && React.cloneElement(icon, {className: styles.icon})
    
    return (
        <button className={btnStyle} onClick={onClick} type={type} disabled={enabled === false}>
            {_icon}
            {children}
        </button>
    )
}