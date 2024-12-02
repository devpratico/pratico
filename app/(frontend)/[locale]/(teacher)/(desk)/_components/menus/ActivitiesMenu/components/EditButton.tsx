'use client'
import { IconButton, DropdownMenu, AlertDialog, Button, Flex } from '@radix-ui/themes'
import { SquarePen, EllipsisVertical, Trash2, Copy } from 'lucide-react'
import { useState } from 'react'
import { deleteActivity, duplicateActivity } from '@/app/(backend)/api/activity/activitiy.client'
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation'
import { fetchActivity } from '@/app/(backend)/api/activity/activitiy.client'
import useActivityCreationStore from '@/app/(frontend)/_stores/useActivityCreationStore'
import logger from '@/app/_utils/logger'


interface EditButtonProps {
    activityId: number
}

export default function EditButton({ activityId }: EditButtonProps) {
    const router = useRouter()
    const [deleteOpen, setDeleteOpen] = useState(false)

    async function handleDelete() {
        await deleteActivity(activityId)
        router.refresh()
    }

    async function handleDuplicate() {
        await duplicateActivity({ id: activityId })
        router.refresh()
    }

    return (
        <>
            <DropdownMenu.Root modal>

                <DropdownMenu.Trigger>
                    <IconButton size='1' variant='ghost' color='gray'>
                        <EllipsisVertical size={18} />
                    </IconButton>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content side='top'>

                    <DropdownMenu.Item onSelect={async () => await openActivityCreation(activityId)}>
                        <SquarePen size={15}/>
                        <span>Modifier</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onSelect={handleDuplicate}>
                        <Copy size={15} />
                        <span>Dupliquer</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator />

                    <DropdownMenu.Item color='red' onSelect={() => setDeleteOpen(true)}>
                        <Trash2 size={15}/>
                        <span>Supprimer</span>
                    </DropdownMenu.Item>

                </DropdownMenu.Content>
            </DropdownMenu.Root>


            <AlertDialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialog.Content>

                    <AlertDialog.Title>
                        Êtes-vous sûr de vouloir supprimer cette activité ?
                    </AlertDialog.Title>

                    <AlertDialog.Description>
                        Cette action est irréversible.
                    </AlertDialog.Description>


                    <Flex justify='end' gap='2'>
                        <AlertDialog.Cancel>
                            <Button variant='soft' color='gray'>Annuler</Button>
                        </AlertDialog.Cancel>

                        <AlertDialog.Action onClick={handleDelete}>
                            <Button color='red'>Supprimer</Button>
                        </AlertDialog.Action>
                    </Flex>

                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    )
}


async function openActivityCreation(id: number) {
    const { data, error } = await fetchActivity(id)
    if (error || !data) return

    const activity = data.object
    if (activity.type == 'poll' && activity.schemaVersion == '3') {
        const openActivity = useActivityCreationStore.getState().openActivity
        openActivity({ id, activity})
    } else {
        logger.error('supabase:database', 'activity is not poll or not schemaVersion 3')
    }    
}