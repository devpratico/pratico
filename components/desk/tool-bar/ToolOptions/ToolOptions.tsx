import styles from './ToolOptions.module.css'


type Option = "colors" | "strokeWidth"

interface ToolOptionsProps {
    options: Option[];
}



export default function ToolOptions({options}: ToolOptionsProps) {
    return (
        <div className={styles.container}>
            Hello
        </div>
    )
}