import styles from './TextField.module.css';


export interface TextFieldProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    className?: string;
    type?: "text" | "password" | "email" | "number";
    disabled?: boolean;
    autoFocus?: boolean;
    style?: React.CSSProperties;
    name?: string;
    id?: string;
    autoComplete?: string;
    spellCheck?: boolean;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    pattern?: string;
    title?: string;
    readOnly?: boolean;
    tabIndex?: number;
    inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    size?: number;
    step?: number;
}

export default function TextField(props: TextFieldProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange(e.target.value);
        }
    }

    const handleBlur = () => {
        if (props.onBlur) {
            props.onBlur();
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (props.onKeyDown) {
            props.onKeyDown(e);
        }
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (props.onKeyUp) {
            props.onKeyUp(e);
        }
    }

    const handleFocus = () => {
        if (props.onFocus) {
            props.onFocus();
        }
    }

    return (
        <input
            className={`${styles.Input} ${props.className}`}
            type={props.type || "text"}
            placeholder={props.placeholder}
            value={props.value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onFocus={handleFocus}
            disabled={props.disabled}
            autoFocus={props.autoFocus}
            style={props.style}
            name={props.name}
            id={props.id}
            autoComplete={props.autoComplete}
            spellCheck={props.spellCheck}
            maxLength={props.maxLength}
            minLength={props.minLength}
            required={props.required}
            pattern={props.pattern}
            title={props.title}
            readOnly={props.readOnly}
            tabIndex={props.tabIndex}
            inputMode={props.inputMode}
            size={props.size}
            step={props.step}
        />
    )
}