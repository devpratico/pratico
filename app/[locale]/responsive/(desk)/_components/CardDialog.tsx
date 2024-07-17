'use client'
import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';


interface CardDialogProps {
    trigger: React.ReactNode
    children: React.ReactNode
}

export default function CardDialog({trigger, children}: CardDialogProps) {
    const [open, setOpen] = useState(false)
    const [container, setContainer] = useState<HTMLElement | null>(null)

    useEffect(() => {
        setContainer(document.getElementById('card-dialog-box'))
    }, [])

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>

            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

            <Dialog.Overlay style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,.3)',
                zIndex: '1',
            }} />

            <Dialog.Portal container={container}>
                <Dialog.Content
                    id= 'card-dialog'
                    style={{
                        position: 'absolute',
                        bottom:'0',
                        top: 'var(--space-8)',
                        width: '100%',
                        zIndex: '2',
                        paddingRight: 'env(safe-area-inset-right)',
                        paddingLeft: 'env(safe-area-inset-left)',
                        backgroundColor: 'var(--accent-1)',
                        boxShadow: 'var(--shadow-6)',
                        borderRadius: 'var(--radius-6) var(--radius-6) 0 0',
                    }}
                >
                    {children}
                </Dialog.Content>
            </Dialog.Portal>

        </Dialog.Root>
    )
}