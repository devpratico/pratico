"use client";
import styles from "./Dialog.module.css";
import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface DialogContentProps {
    children: React.ReactNode;
}

/**
 * A [Radix library dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent({ children }, forwardedRef) {

    return (
        <DialogPrimitive.Portal container={document.body}>
            <DialogPrimitive.Overlay className={styles.DialogOverlay} />

            <DialogPrimitive.Content ref={forwardedRef} className={styles.DialogContent} onPointerDownOutside={(event) => console.log(event)}>
                <DialogPrimitive.Close aria-label="Close">
                    <p>close</p>
                </DialogPrimitive.Close>
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;