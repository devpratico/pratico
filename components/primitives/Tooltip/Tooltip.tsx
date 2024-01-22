"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styles from "./Tooltip.module.css";

interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    side: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    arrow?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
}

/**
 * A [Radix library tooltip](https://radix-ui.com/primitives/docs/components/tooltip)
 */
export default function Tooltip({ children, content, side, align = "center", arrow = false, open, onOpenChange, defaultOpen }: TooltipProps) {
    return (
        <TooltipPrimitive.Provider delayDuration={0}>
            <TooltipPrimitive.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
                <TooltipPrimitive.Trigger className={styles.button} asChild>{children}</TooltipPrimitive.Trigger>
                <TooltipPrimitive.Content side={side} align={align} className={styles.TooltipContent}>
                    {content}
                    {arrow && <TooltipPrimitive.Arrow width={11} height={5} className={styles.TooltipArrow} />}
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}