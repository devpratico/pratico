'use client'
import { useState, useEffect } from "react"
import * as Dialog from '@radix-ui/react-dialog';
import { ScrollArea, Container, Spinner } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Suspense } from "react";

export default function MenuDialog({children}: {children: React.ReactNode}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)
  
    // Open or close the dialog based on the presence of the 'menu' query parameter
    useEffect(() => {
        setOpen(searchParams.has('menu'))
    }, [searchParams])

    // When the dialog is opened or closed, add or remove the 'menu' query parameter
    function setOpenAndReplace(value: boolean) {
        setOpen(value)
        if (!value) {
            const params = new URLSearchParams(searchParams.toString())
            params.delete('menu')
            router.replace(pathname + '?' + params.toString())
        }
    }


    return (
        <Dialog.Root open={open} onOpenChange={setOpenAndReplace} modal={false}>
            <Dialog.Content style={{
                pointerEvents:'auto',
                position:'absolute',
                right:'0',
                width:'100%',
                maxWidth:'400px',
                height:'100%',
                zIndex:'201',
                paddingRight: 'env(safe-area-inset-right)',
                backgroundColor:'var(--accent-1)',
                boxShadow:'var(--shadow-3)',
                animation: 'appear 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onInteractOutside={(event) => {
                    // If click is on the #menu-tabs element, don't close the dialog
                    if (event.target instanceof Element && event.target.closest('#menu-tabs')) {event.preventDefault()}
                }}
            >
                <style>{appearAnimation}</style>

                <ScrollArea>
                    <Container px='5'>
                        <Suspense fallback={<Spinner />}>
                            {children}
                        </Suspense>
                    </Container>
                </ScrollArea>
            </Dialog.Content>
        </Dialog.Root>
    )
}


const appearAnimation = `
    @keyframes appear {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(0);
        }
    }
`