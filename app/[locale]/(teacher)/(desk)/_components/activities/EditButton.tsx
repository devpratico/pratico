'use client'
import { IconButton, DropdownMenu, AlertDialog, Button, Flex } from '@radix-ui/themes'
import { SquarePen, EllipsisVertical, Trash2, Copy } from 'lucide-react'
import { useState } from 'react'
import CardDialog from '../CardDialog'
import { Quiz } from '@/app/_types/quiz'
import { Poll } from '@/app/_types/poll'
import { QuizProvider } from '@/app/_hooks/useQuiz'
import { PollProvider } from '@/app/_hooks/usePoll'
import QuizCreation from './QuizCreation'
import PollCreation from './PollCreation'
import { deleteActivity, duplicateActivity } from '@/app/api/_actions/activities'


interface EditButtonProps {
    activityId: number
    initialActivity: Quiz | Poll
}

export default function EditButton({ activityId, initialActivity }: EditButtonProps) {
    const [open, setOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    async function handleDelete() {
        await deleteActivity(activityId)
    }

    async function handleDuplicate() {
        await duplicateActivity(activityId)
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

                    <DropdownMenu.Item onSelect={() => setOpen(true)}>
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



            <CardDialog open={open} setOpen={setOpen} preventClose>
                {
                    initialActivity.type === 'quiz' ? (
                        <QuizProvider quiz={initialActivity as Quiz}>
                            <QuizCreation idToSaveTo={activityId} closeDialog={() => setOpen(false)} />
                        </QuizProvider>
                    ) : (
                        <PollProvider poll={initialActivity as Poll}>
                            <PollCreation idToSaveTo={activityId} closeDialog={() => setOpen(false)} />
                        </PollProvider>
                    )
                }
            </CardDialog>


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