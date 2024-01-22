"use client";
import styles from "./Dialog.module.css";
import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import CloseIcon from "@/components/icons/CloseIcon";

interface DialogContentProps {
    children: React.ReactNode;
    closeBtn?: boolean;
}

/**
 * A [Radix library dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent({ children, closeBtn=false }, forwardedRef) {

    const CloseBtn = () => (
        <DialogPrimitive.Close aria-label="Close" className={styles.DialogClose}>
            <CloseIcon />
        </DialogPrimitive.Close>
    )

    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className={styles.DialogOverlay} />

            <DialogPrimitive.Content ref={forwardedRef} className={styles.DialogContent}>
                {closeBtn && <CloseBtn/>}
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;