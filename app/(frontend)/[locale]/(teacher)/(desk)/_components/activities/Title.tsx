'use client'
import { Flex, IconButton, TextField, Popover, VisuallyHidden, Dialog, Heading } from '@radix-ui/themes'
import { Check, SquarePen } from 'lucide-react'
import { useState } from 'react'



interface TitleProps {
    type: 'quiz' | 'poll'
    title: string
    onEdit: (newTitle: string) => void
}

export default function Title({ type, title, onEdit }: TitleProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(title)
    const defaultTitle = type === 'quiz' ? 'Quiz sans titre' : 'Sondage sans titre'

    function handleConfirm() {
        onEdit(value)
        setOpen(false)
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') handleConfirm();
    }

    return (
        <Flex gap='3' align='center'>

            {/* <Dialog.Title > */}
			<Heading style={{ margin: 0 }} trim='both'>{title || defaultTitle}</Heading>
			{/* </Dialog.Title> */}
            {/* <VisuallyHidden><Dialog.Description>{title || defaultTitle}</Dialog.Description></VisuallyHidden> */}

            <Popover.Root open={open} onOpenChange={setOpen}>

                <Popover.Trigger>
                    <IconButton variant='ghost' size='2' color='gray'><SquarePen /></IconButton>
                </Popover.Trigger>

                <Popover.Content>
                    <TextField.Root
                        placeholder='Titre...' value={value}
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={handleKeyDown}
                    >
                        <TextField.Slot></TextField.Slot>
                        <TextField.Slot>
                            <IconButton variant='ghost' size='1' onClick={handleConfirm}>
                                <Check />
                            </IconButton>
                        </TextField.Slot>
                    </TextField.Root>
                </Popover.Content>

            </Popover.Root>

        </Flex>
    )
}