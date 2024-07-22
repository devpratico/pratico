'use client'
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';


interface CardDialogProps {
    trigger: React.ReactNode
    children: React.ReactNode
}

export default function CardDialog({trigger, children}: CardDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>

            <style>{slideUpAnimation}</style>
            <style>{fadeInAnimation}</style>

            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

            <Dialog.Portal container={document.getElementsByClassName('radix-themes')[0] as HTMLElement}>

                <Dialog.Overlay style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,.3)',
                    animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />

                <Dialog.Content
                    style={{
                        position: 'absolute',
                        bottom:'0',
                        top: 'var(--space-9)',
                        width: '100%',
                        //zIndex: '1',
                        paddingRight: 'env(safe-area-inset-right)',
                        paddingLeft: 'env(safe-area-inset-left)',
                        backgroundColor: 'var(--accent-1)',
                        boxShadow: 'var(--shadow-6)',
                        borderRadius: 'var(--radius-6) var(--radius-6) 0 0',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
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