'use client'
import styles from './Title.module.css'
import { useState, useEffect, useRef } from "react"

interface TitleProps {
    initialValue: string;
    placeholder: string;
    /**
     * If true, the input will be focused when the component is mounted.
     */
    focusFirst: boolean;
    /**
     * If true, the input will be editable.
     */
    editable: boolean;
}

/**
 * This component is a text field that automatically resizes to fit its content.
 * It uses a hidden `span` element to measure the width of the text.
 */
export default function Title({ initialValue, placeholder, focusFirst, editable }: TitleProps) {

    const [inputValue, setInputValue] = useState(initialValue)
    const inputRef = useRef<HTMLInputElement>(null);
    const sizerRef = useRef<HTMLSpanElement> (null);

    useEffect(() => {
        if (inputRef.current) {
            // Focus the input when the component is mounted (if desired)
            if (focusFirst && editable) {
                inputRef.current.focus();
                //inputRef.current.select();
            }
        }
    },[focusFirst, editable]);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    }

    useEffect(() => {
        if (sizerRef.current && inputRef.current) {
            if (inputValue === '') {
                sizerRef.current.textContent = placeholder;
            } else {
                sizerRef.current.textContent = inputValue;
            }
            const width = sizerRef.current.offsetWidth;
            const border = inputRef.current.offsetWidth - inputRef.current.clientWidth;
            const cursorWidth = 2;
            inputRef.current.style.width = `${width + border + cursorWidth}px`;
        }
    }, [inputValue, placeholder]);


    const inputProps = {
        type: "text",
        value: inputValue,
        onChange: handleTitleChange,
        placeholder: placeholder,
        readOnly: !editable,
        className: `${styles.input} ${styles.textField} ${editable ? styles.inputHoverable : ''}`,
        ref: inputRef,
        disabled: !editable
    }

    const spanProps = {
        className: `${styles.sizer} ${styles.textField}`,
        ref: sizerRef
    }

    return (
        <div className={styles.wrapper}>
            <input {...inputProps} />
            <span  {...spanProps}  />
        </div>
    )
}