'use client'
import {Popover, Dialog, TextField, Button, IconButton, Flex, Text, Heading, Tooltip } from "@radix-ui/themes";
import { saveCapsuleTitle } from '@/app/api/_actions/room2';
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "@/app/_intl/intlNavigation";
import { Check } from "lucide-react";


interface EditDialogProps {
    capsuleId: string;
    trigger: React.ReactNode;
}


export default function EditDialog({ capsuleId, trigger }: EditDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSave() {
        setLoading(true)
        try {
            await saveCapsuleTitle(capsuleId, title)
            setOpen(false)
            setLoading(false)
            router.refresh()
        } catch (error) {
            setError((error as PostgrestError).message)
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



                <Text color='red' size='2'>{error}</Text>

                    


            </Popover.Content>
        </Popover.Root>
    )
}