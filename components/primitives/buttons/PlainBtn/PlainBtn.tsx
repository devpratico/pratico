'use client'
import React from 'react';
import styles from './PlainBtn.module.css';


export interface PlainBtnProps {
    /**
     * Usually an icon
     */
    children?: JSX.Element;
    message?: string;
    size?: "s" | "m" | "l";
    style?: "solid" | "soft" | "outline" | "ghost";
    color?: "primary" | "secondary" | "background" | "red" | "green";
    onClick?: () => void;
    enabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

export default function PlainBtn({
    children,
    message,
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

    const _icon = children && React.cloneElement(children, {className: styles.icon})
    
    return (
        <button className={btnStyle} onClick={onClick} type={type} disabled={enabled === false} tabIndex={0}>
            {_icon}
            <p className={styles.text}>{message}</p>
        </button>
    )
}