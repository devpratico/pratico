'use client'
import * as Dialog from '@radix-ui/react-dialog';
import { Theme } from '@radix-ui/themes';
import useWindow from '@/app/(frontend)/_hooks/useWindow';


interface CardDialogProps {
    trigger?: React.ReactNode

    /**
     * If `true`, the dialog will not close when clicking outside of it.
     */
    preventClose?: boolean

    open?: boolean

    setOpen?: (open: boolean) => void

    topMargin?: string

    children: React.ReactNode
}


/**
 * A dialog that slides up from the bottom of the screen.
 * It can be used independently from the `GlobalCardDialog` system, with its own trigger or open state.
 * Prefer using the `GlobalCardDialog` system when possible.
 */
export default function CardDialog({trigger, preventClose=false, open, setOpen, topMargin, children}: CardDialogProps) {
    const { width: viewPortWidth } = useWindow()
    const topPosition = topMargin || (viewPortWidth && viewPortWidth > 520 ? 'var(--space-9)' : 'var(--space-5)')

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>

            { trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

            <Dialog.Portal>
                {/* The portal puts its content out of the Theme provider, so we need to wrap it in a Theme provider */}
                {/* No need to configure the theme, it will inherit the parent theme */}
                {/* https://www.radix-ui.com/themes/docs/overview/styling#missing-styles-in-portals */}
                <Theme>

                    <style>{slideUpAnimation}</style>
                    <style>{fadeInAnimation}</style>

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
                </Theme>
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