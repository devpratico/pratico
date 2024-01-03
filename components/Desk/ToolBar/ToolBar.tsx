import styles from './ToolBar.module.css'
import { useState } from 'react';
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { faArrowPointer }   from '@fortawesome/free-solid-svg-icons';
import { faPen }            from '@fortawesome/free-solid-svg-icons';
import { faT }              from '@fortawesome/free-solid-svg-icons';
import { faShapes }         from '@fortawesome/free-solid-svg-icons';
import { faImage }          from '@fortawesome/free-solid-svg-icons';
import { faEraser }         from '@fortawesome/free-solid-svg-icons';
import { IconDefinition }   from '@fortawesome/free-solid-svg-icons';

/*
const iconsMap = {
    "arrow":  faArrowPointer,
    "pen":    faPen,
    "text":   faT,
    "shapes": faShapes,
    "image":  faImage,
    "eraser": faEraser,
}

export type ToolName = keyof typeof iconsMap;
*/

/**
 * IDs of default tlDraw tools (see tldraw documentation)
 */
type TlDrawToolId = "select" | "draw" | "eraser";
const iconsMap: Record<TlDrawToolId, IconDefinition> = {
    "select":   faArrowPointer,
    "draw":   faPen,
    "eraser": faEraser,
}


interface ToolBarButtonProps {
    toolId: TlDrawToolId;
    onClick: () => void;
    active: boolean;
}


function ToolBarButton({toolId, onClick, active}: ToolBarButtonProps) {
    return (
        <button onClick={onClick} className={styles.btn + " " + (active ? styles.active : "")}>
            <FontAwesomeIcon icon={iconsMap[toolId]} />
        </button>
    )
}


interface ToolBarProps {
    activeToolId: string; // But should be a TlDrawToolId
    setTool: (toolId: TlDrawToolId) => void;
}

export default function ToolBar({activeToolId, setTool}: ToolBarProps) {
    return (
        <div className={`${styles.container} bigShadow`}>
            <ToolBarButton toolId="select" onClick={()=>setTool('select')} active={activeToolId === "select"}  />
            <ToolBarButton toolId="draw"   onClick={()=>setTool('draw')}   active={activeToolId === "draw"}  />
            <ToolBarButton toolId="eraser" onClick={()=>setTool('eraser')} active={activeToolId === "eraser"}/>
        </div>
    )
}