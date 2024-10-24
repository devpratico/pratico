'use client'
import {Popover, TextField, IconButton, Text, Callout } from "@radix-ui/themes";
import Tooltip from '@/app/(frontend)/[locale]/_components/TooltipL';
import { saveCapsuleTitle } from "@/app/(backend)/api/capsule/capsule.client";
import { useState } from "react";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Check, TriangleAlert } from "lucide-react";


interface EditPopoverProps {
    capsuleId: string;
    trigger: React.ReactNode;
}


export default function EditPopover({ capsuleId, trigger }: EditPopoverProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSave() {
        setLoading(true)
        setError(null)
        try {
            await saveCapsuleTitle(capsuleId, title)
            setOpen(false)
            setLoading(false)
            router.refresh()
        } catch (error) {
            setError((error as Error).message)
            setLoading(false)
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') handleSave();
    }

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>

            <Tooltip content='Renommer la capsule'>
                <Popover.Trigger>{trigger}</Popover.Trigger>
            </Tooltip>

            <Popover.Content size='1'>
                
                <TextField.Root
                    placeholder='Titre de la capsule'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                >
                    <TextField.Slot/>
                        
                    <TextField.Slot>
                        <IconButton size='1' variant='ghost' loading={loading} onClick={handleSave} type='submit'><Check size='16'/></IconButton>
                    </TextField.Slot>
                </TextField.Root>

                {
                    error &&
                    <Callout.Root color='red' role='alert' size='1' mt='3'>
                        <Callout.Icon>
                            <TriangleAlert size='16'/>
                        </Callout.Icon>
                        <Callout.Text>
                            {error}
                        </Callout.Text>
                    </Callout.Root>
                }

            </Popover.Content>
        </Popover.Root>
    )
}