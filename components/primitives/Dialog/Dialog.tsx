import styles from "./Dialog.module.css";
import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import CloseIcon from "@/components/icons/CloseIcon";

interface DialogContentProps {
    children: React.ReactNode;
    showCloseBtn?: boolean;
    /*
    * Wether to portal the dialog to the body or not
    */
    portal?: boolean;
    className?: string;
}

/**
 * A [Radix library dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */
// TODO: See React 18 improvements for forwardRef
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
    function DialogContentF({
        children,
        showCloseBtn=false ,
        portal=true,
        className,
    }, forwardedRef) {

    const CloseBtn = () => (
        <DialogPrimitive.Close aria-label="Close" className={styles.DialogClose}>
            <CloseIcon />
        </DialogPrimitive.Close>
    )

    const Content = () => (
        <DialogPrimitive.Content ref={forwardedRef} className={styles.DialogContent + " " + className}>
            {showCloseBtn && <CloseBtn/>}
            {children}
        </DialogPrimitive.Content>
    )

    if (!portal) {
        return <Content />

    } else {
        return (
            <DialogPrimitive.Portal>
                <Content />
            </DialogPrimitive.Portal>
        );
    }
});


export const DialogOverlay = () => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.DialogOverlay} />
    </DialogPrimitive.Portal>
);

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;