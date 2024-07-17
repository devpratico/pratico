'use client'
import { useState, useEffect } from "react"
import * as Dialog from '@radix-ui/react-dialog';
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/app/_intl/intlNavigation";

export default function MenuDialog() {
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
                position:'absolute',
                right:'0',
                width:'100%',
                height:'100%',
                maxWidth:'400px',
                zIndex:'1',
                backgroundColor:'var(--accent-1)',
                boxShadow:'var(--shadow-5)',
                //borderRadius:'var(--radius-3)'
                }}
                onInteractOutside={(event) => {
                    // If click is on the #menu-tabs element, don't close the dialog
                    if (event.target instanceof Element && event.target.closest('#menu-tabs')) event.preventDefault()
                }}
            >
                Dialog
            </Dialog.Content>
        </Dialog.Root>
    )
}