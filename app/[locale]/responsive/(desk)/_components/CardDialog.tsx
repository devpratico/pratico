'use client'
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';


interface CardDialogProps {
    trigger: React.ReactNode

    /**
     * If `true`, the dialog will not close when clicking outside of it.
     */
    preventClose?: boolean

    children: React.ReactNode
}

export default function CardDialog({trigger, preventClose=false, children}: CardDialogProps) {
    const [open, setOpen] = useState(false)
    const viewPortWidth = window.innerWidth
    const topPosition = viewPortWidth > 520 ? 'var(--space-9)' : 'var(--space-5)'

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>

            <style>{slideUpAnimation}</style>
            <style>{fadeInAnimation}</style>

            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

            {/* Default portal puts element in `body`, but then styling is missing https://www.radix-ui.com/themes/docs/overview/styling#missing-styles-in-portals */}
            {/* To fix that, we choose the `radix-theme` element instead, which is in the root layout.*/}
            <Dialog.Portal container={document.getElementById('radix-theme')!}>

                <Dialog.Overlay style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'var(--gray-a10)',
                    animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />

                <Dialog.Content
                    style={{
                        position: 'absolute',
                        bottom:'0',
                        top: topPosition,
                        width: '100%',
                        paddingRight: 'env(safe-area-inset-right)',
                        paddingLeft: 'env(safe-area-inset-left)',
                        backgroundColor: 'var(--accent-1)',
                        boxShadow: 'var(--shadow-6)',
                        borderRadius: 'var(--radius-6) var(--radius-6) 0 0',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onInteractOutside={(event) => { if (preventClose) event.preventDefault()}}
                >   
                    {children}
                </Dialog.Content>

            </Dialog.Portal>

        </Dialog.Root>
    )
}

const slideUpAnimation = `
        @keyframes slideUp {
            0% {
                transform: translateY(100%);
            }
            100% {
                transform: translateY(0);
            }
        }
    `;

const fadeInAnimation = `
        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    `;