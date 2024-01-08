'use client'
import * as TooltipPrimitives from '@radix-ui/react-tooltip';


interface TooltipProps {
    /**
     * The content of the tooltip modal
     */
    content: React.ReactNode;

    /**
     * The element that will trigger the tooltip
     */
    children: React.ReactNode;

    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    delayDuration?: number;
}

/**
 * A [Radix library tooltip](https://radix-ui.com/primitives/docs/components/tooltip)
 */
export default function Tooltip({content, children, side='top', align='center', sideOffset=0, delayDuration=0}: TooltipProps) {
    return (
        <TooltipPrimitives.Provider delayDuration={delayDuration}>
            <TooltipPrimitives.Root>

                <TooltipPrimitives.Trigger asChild>
                    {children}
                </TooltipPrimitives.Trigger>

                <TooltipPrimitives.Content sideOffset={sideOffset} side={side} align={align}>
                    {content}
                </TooltipPrimitives.Content>

            </TooltipPrimitives.Root>
        </TooltipPrimitives.Provider>
    )
}