'use client'
import styles from './CapsuleTitle.module.css'
import { useState, useEffect, useRef } from "react"
import { getCapsuleTitle, setCapsuleTitle } from '@/supabase/services/capsules'
import logger from '@/utils/logger'

interface TitleProps {
    capsuleId?: string;
}

/**
 * This component is a text field that automatically resizes to fit its content.
 * It uses a hidden `span` element to measure the width of the text.
 */
export default function CapsuleTitle({ capsuleId }: TitleProps) {

    const placeholder = "Session name";
    const [inputValue, setInputValue] = useState('')

    // hasChanged is true as soon as the input value changes, and until the form is submitted
    // We use it to only submit the form when the input has changed
    const [hasChanged, setHasChanged] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null);
    const sizerRef = useRef<HTMLSpanElement> (null);
    const hiddenSubmitButtonRef = useRef<HTMLButtonElement>(null);

    // Get title from the database
    useEffect(() => {
        async function getTitle() {
            if (!capsuleId) return
            try {
                const title = await getCapsuleTitle(capsuleId)
                setInputValue(title)
                // Focus if title empty
                if (title === '') {
                    inputRef.current?.focus();
                }
            } catch (error) {
                console.error('Error getting capsule title', error)
            }
        }
        getTitle()
    }, [capsuleId])

    // Resize the input to fit the content
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

    // Submit the form when the input loses focus
    useEffect(() => {
        const handleBlur = (e: FocusEvent) => {
            if (hasChanged) {
                logger.log('react:component', 'input blurred')
                hiddenSubmitButtonRef.current?.click();
            }
        }
        inputRef.current?.addEventListener('blur', handleBlur)
        return () => { inputRef.current?.removeEventListener('blur', handleBlur)}
    }, [hasChanged])
    

    // Update the state when the input changes
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        setHasChanged(true)
    }

    // Save title to database when form is submitted
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (capsuleId && hasChanged) {
            try {
                logger.log('react:component', 'setting capsule title', { capsuleId, inputValue })
                await setCapsuleTitle(capsuleId, inputValue)
                logger.log('react:component', 'capsule title set', { capsuleId, inputValue })
                setHasChanged(false)
            } catch (error) {
                console.error('Error setting capsule title', error)
            }
        }
    }

    // Submit form when enter key is pressed
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          logger.log('react:component', 'enter key pressed', { inputValue })
          inputRef.current?.blur(); // Remove focus from the input
          // No need to call handleSubmit directly, as it will be called when the input loses focus:
          //hiddenSubmitButtonRef.current?.click();
        }
    };

    const inputProps = {
        type: "text",
        value: inputValue,
        onChange: handleTitleChange,
        placeholder: placeholder,
        className: `${styles.input} ${styles.textField} ${styles.inputHoverable}`,
        ref: inputRef,
    }

    const spanProps = {
        className: `${styles.sizer} ${styles.textField}`,
        ref: sizerRef
    }

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className={styles.wrapper}>
            <input {...inputProps} />
            <span  {...spanProps}  />

            {/* Invisible submit button; it won't be visible or interactable but can be programmatically clicked */}
            <button type="submit" ref={hiddenSubmitButtonRef} style={{ display: 'none' }} />
        </form>
    )
}