import styles from './ToolButton.module.css'
import { IconDefinition }   from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { faArrowPointer }   from '@fortawesome/free-solid-svg-icons';
import { faPen }            from '@fortawesome/free-solid-svg-icons';
import { faEraser }         from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@/components/primitives/Tooltip/Tooltip';

/**
 * IDs of default tlDraw tools (see tldraw documentation)
 */
export type ToolId = "select" | "draw" | "eraser";
const iconsMap: Record<ToolId, IconDefinition> = {
    "select": faArrowPointer,
    "draw":   faPen,
    "eraser": faEraser,
}


interface ToolButtonProps {
    toolId: ToolId;
    onClick: () => void;
    active: boolean;
    tooltipContent?: JSX.Element;
}

/**
 * This goes inside the ToolBar.
 */
export default function ToolButton({toolId, onClick, active, tooltipContent}: ToolButtonProps) {

    // The button itself
    const Button = () => (
        <button onClick={onClick} className={styles.btn + " " + (active ? styles.active : "")}>
            <FontAwesomeIcon icon={iconsMap[toolId]} />
        </button>
    );

    // If no tooltip, return the button itself
    if (!tooltipContent) {
        return <Button />;
    } else {
        // Else, wrap the button in a tooltip
        return (
            <Tooltip content={tooltipContent} side="right">
                <Button />
            </Tooltip>
        )
    }
}