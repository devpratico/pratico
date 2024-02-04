"use client"
import { useState } from 'react';
import styles from './Popover.module.css'
import * as PopoverPrimitive from '@radix-ui/react-popover'


interface PopoverProps {
    children: React.ReactNode;
    content:  React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    arrow?: boolean;
}


/**
 * A [Radix library popover](https://radix-ui.com/primitives/docs/components/popover)
 */
export default function Popover({ children, content, side="right", align="center", defaultOpen, open, onOpenChange, modal, arrow=false }: PopoverProps) {

    //const [openState, setOpenState] = useState<boolean | undefined>(defaultOpen);

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen} modal={modal}>

            <PopoverPrimitive.Trigger className={styles.trigger} asChild>
                {/* We need to wrap the children in a div because the trigger needs an element compatible with `ref` */}
                <div
                    //onPointerEnter={() => setOpenState(true)}
                    //onMouseLeave={() => setOpenState(false)}
                >
                    {children}
                </div>
            </PopoverPrimitive.Trigger>


            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    side={side}
                    className={styles.content}
                    align={align}
                    //onMouseEnter={() => setOpenState(true)}
                    //onMouseLeave={() => setOpenState(false)}
                    >

                    { arrow && <PopoverPrimitive.Arrow className={styles.arrow} /> }

                    {/*
                    <div className={styles.contentInner}>
                        <PopoverPrimitive.Close className={styles.close} />
                    </div>
                    */}

                    {content}

                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>

        </PopoverPrimitive.Root>
    )
}



/*
onPointerDownOutside={(event) => {
    if (event.target !== triggerRef.current?.children[0]) {
        setOpenState(false)
    }
}}
*/