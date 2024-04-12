import styles from "./Dialog.module.css";
import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import CloseIcon from "@/app/[locale]/_components/icons/CloseIcon";

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
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
    function DialogContentF({
        children,
        showCloseBtn=false ,
        portal=true,
        className,
    }, forwardedRef) {

    const content = (
        <Content ref={forwardedRef} className={className} showCloseBtn={showCloseBtn}>
            {children}
        </Content>
    );

    return portal ? <DialogPrimitive.Portal>{content}</DialogPrimitive.Portal> : content;
});


export const DialogOverlay = () => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.DialogOverlay} />
    </DialogPrimitive.Portal>
);

const CloseBtn = () => (
    <DialogPrimitive.Close aria-label="Close" className={styles.DialogClose}>
        <CloseIcon />
    </DialogPrimitive.Close>
);

// Refactor Content to support ref forwarding
const Content = forwardRef<HTMLDivElement, { className?: string; children: React.ReactNode; showCloseBtn?: boolean }>(
    function ContentF({ className, children, showCloseBtn }, ref) {
        return (
            <DialogPrimitive.Content ref={ref} className={`${styles.DialogContent} ${className}`}>
                {showCloseBtn && <CloseBtn />}
                {children}
            </DialogPrimitive.Content>
        );
    }
);

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;