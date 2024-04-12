'use client'
import styles from './CapsuleTitle.module.css'
import { useState, useEffect, useRef } from "react"
import { fetchCapsuleTitle, saveCapsuleTitle } from '@/supabase/services/capsules'
import logger from '@/app/_utils/logger'
//import { useCapsule } from '@/hooks/useCapsule';
import { useParams, useSearchParams } from 'next/navigation';
import { useTLEditor } from '@/app/[locale]/_hooks/useTLEditor'

interface TitleProps {
    /**
     * If true, the input won't be editable
     */
    disabled?: boolean;
}

/**
 * This component is a text field that automatically resizes to fit its content.
 * It uses a hidden `span` element to measure the width of the text.
 */
export default function CapsuleTitle({ disabled }: TitleProps) {

    //const { capsule } = useCapsule()
    //const capsuleId = capsule?.id
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const searchParams = useSearchParams()
    const local = searchParams.get('local') === 'true'
    const placeholder = "Session name";
    const [inputValue, setInputValue] = useState('')
    const { editor } = useTLEditor()

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

            // FOR LOCAL DOCUMENTS
            if (local) {
                const localTitle = editor?.getDocumentSettings().name
                setInputValue(localTitle || '')
                return
            }

            // FOR DATABASE DOCUMENTS
            try {
                const title = await fetchCapsuleTitle(capsuleId)
                setInputValue(title)
                // Focus if title empty
                if (title === '') {
                    inputRef.current?.focus();
                }
            } catch (error) {
                logger.error('react:component', 'Error getting capsule title', error)
            }
        }
        getTitle()
    }, [capsuleId, local, editor])

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
    

    // Update the state when the input changes
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        setHasChanged(true)
    }

    // Save title when form is submitted
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // FOR LOCAL DOCUMENTS
        if (local) {
            editor?.updateDocumentSettings({ name: inputValue })
            setHasChanged(false)
            logger.log('react:component', 'local capsule title set', { inputValue })
            return
        }

        // FOR DATABASE DOCUMENTS
        if (capsuleId && hasChanged) {
            try {
                logger.log('react:component', 'setting capsule title', { capsuleId, inputValue })
                await saveCapsuleTitle(capsuleId, inputValue)
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

    // Submit the form when the input loses focus
    useEffect(() => {
        const handleBlur = (e: FocusEvent) => {
            if (hasChanged) {
                logger.log('react:component', 'input blurred')
                hiddenSubmitButtonRef.current?.click();
            }
        }
        const inputEl = inputRef.current
        inputEl?.addEventListener('blur', handleBlur)
        return () => { inputEl?.removeEventListener('blur', handleBlur)} // Cleanup
    }, [hasChanged])


    const inputProps = {
        type: "text",
        value: inputValue,
        onChange: handleTitleChange,
        placeholder: placeholder,
        className: `${styles.input} ${styles.textField} ${!disabled ? styles.inputHoverable : ''}`,
        ref: inputRef,
        disabled: disabled
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