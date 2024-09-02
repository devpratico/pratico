'use client';
import { DropdownMenu, IconButton } from '@radix-ui/themes'
import { Ellipsis, TextCursor, Copy, Trash2 } from 'lucide-react';
import { deleteCapsule } from '@/app/api/_actions/capsule';
import { Spinner } from '@radix-ui/themes';
import { useState } from 'react';
import { useRouter } from '@/app/_intl/intlNavigation';


interface MenuProps {
    capsuleId: string;
}


export default function Menu({ capsuleId }: MenuProps) {
    const router = useRouter()
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleDelete(event:Event) {
        event.preventDefault()
        setDeleteLoading(true)
        await deleteCapsule(capsuleId)
        setOpen(false)
        router.refresh()
    }



    return (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger>
                <IconButton radius='full' size='1' variant='soft' style={{ position: 'absolute', top: '0', right: '0', margin: '5px' }}>
                    <Ellipsis size='18' />
                </IconButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>

                <DropdownMenu.Item disabled>
                    <TextCursor size='13' />
                    Renommer
                </DropdownMenu.Item>

                <DropdownMenu.Item disabled>
                    <Copy size='13' />
                    Dupliquer
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item color='red' onSelect={handleDelete} disabled={deleteLoading}>
                    <Spinner loading={deleteLoading}>
                        <Trash2 size='13' />
                    </Spinner>
                    Supprimer
                </DropdownMenu.Item>

            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}