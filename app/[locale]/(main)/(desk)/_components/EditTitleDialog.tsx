'use client'
import { Dialog, TextField, Button, Flex, Text } from "@radix-ui/themes";
import { saveCapsuleTitle } from '@/app/api/_actions/room2';
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";


interface EditDialogProps {
    capsuleId: string;
    trigger: React.ReactNode;
}


export default function EditDialog({ capsuleId, trigger }: EditDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSave() {
        setLoading(true)
        try {
            await saveCapsuleTitle(capsuleId, title)
            setOpen(false)
            setLoading(false)
        } catch (error) {
            setError((error as PostgrestError).message)
            setLoading(false)
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') handleSave();
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{trigger}</Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Renommer la capsule</Dialog.Title>

                <TextField.Root placeholder='Titre de la capsule' value={title} onChange={e => setTitle(e.target.value)} onKeyDown={handleKeyDown} />

                <Flex justify='end' align='center' gap='2' mt='5'>

                    <Text color='red' size='2'>{error}</Text>

                    <Dialog.Close tabIndex={-1}>
                        <Button variant='soft'>Annuler</Button>
                    </Dialog.Close>

                    <Button loading={loading} onClick={handleSave} type='submit'>Enregistrer</Button>

                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}