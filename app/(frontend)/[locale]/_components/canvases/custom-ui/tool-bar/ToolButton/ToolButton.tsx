import React from 'react';
import styles from './ToolButton.module.css'
import Tooltip from '@/app/(frontend)/[locale]/_components/primitives/Tooltip/Tooltip';
import Popover from '@/app/(frontend)/[locale]/_components/primitives/Popover/Popover';
import CursorIcon from '@/app/(frontend)/[locale]/_components/icons/CursorIcon';
import ImageIcon from '@/app/(frontend)/[locale]/_components/icons/ImageIcon';
import EraserIcon from '@/app/(frontend)/[locale]/_components/icons/EraserIcon';
import BlankPenIcon from '@/app/(frontend)/[locale]/_components/icons/BlankPenIcon';
import FontsIcon from '@/app/(frontend)/[locale]/_components/icons/FontsIcon';
import ShapesIcon from '@/app/(frontend)/[locale]/_components/icons/ShapesIcon';

/**
 * IDs of default tlDraw tools (see tldraw documentation)
 */
export type ToolId = "select" | "draw" | "eraser" | "text" | "image" | "shape";

const fill = false;

const iconsMap: Record<ToolId, JSX.Element> = {
    "select": <CursorIcon   fill={fill} />,
    "draw":   <BlankPenIcon fill={fill} />,
    "text":   <FontsIcon    fill={fill} />,
    "shape":  <ShapesIcon   fill={fill} />,
    "image":  <ImageIcon    fill={fill} />,
    "eraser": <EraserIcon   fill={fill} />,
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
        <button onClick={onClick} className={styles.btn + " " + (active ? styles.active : "")} title={toolId}>
            {React.cloneElement(iconsMap[toolId], {fill: active, className: styles.icon})}
        </button>
    )

    // If no tooltip, return just the button, no need to call Tooltip
    if (!tooltipContent) {
        return <Button />;

    } else {
        // Else, wrap the button in a tooltip
        // Also wrap it in a div so that the tooltip can use its ref https://www.radix-ui.com/primitives/docs/guides/composition
        return (
            <Popover content={tooltipContent} side="right">
                <Button />
            </Popover>
        )
    }
}

/*
<Popover content={tooltipContent} side="right">
    <Button />
</Popover>
*/