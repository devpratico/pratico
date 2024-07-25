'use client'
import Thumbnail from '@/app/[locale]/_components/Thumbnail'
import { useNav } from '@/app/_hooks/useNav'
import { useTLEditor } from '@/app/_hooks/useTLEditor'
import { Card, Flex, ScrollArea, DropdownMenu, IconButton, Box } from '@radix-ui/themes'
import { Ellipsis, Trash2, Copy } from 'lucide-react'
import { TLPageId } from 'tldraw'
import logger from '@/app/_utils/logger'
import { useState, useEffect } from 'react'


interface MiniatureProps {
    pageId: TLPageId
    selected: boolean
    onClick: () => void
}


export default function Carousel() {
    const { pageIds, currentPageId, setCurrentPage } = useNav()

    return (
        <Card variant='classic' style={{padding:'0'}} asChild>
            <ScrollArea>
                <Flex gap='3' p='3' height='100%' align='center'>
                    {pageIds.map((id, i) => (
                        <Miniature
                            key={`${id}`}
                            pageId={id}
                            selected={currentPageId === id}
                            onClick={() => setCurrentPage(id)}
                        />
                    ))}
                </Flex>
            </ScrollArea>
        </Card>
    )
}


function Miniature({ pageId, selected, onClick }: MiniatureProps) {
    const [showEllipsis, setShowEllipsis] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const { editor } = useTLEditor()

    useEffect(() => {
        setShowEllipsis(showMenu)
    }, [showMenu])


    return (
        <Box
            width='55px'
            height='36px'
            style={{borderRadius:'var(--radius-2)', boxShadow: selected ? '0 0 0 3px var(--accent-10)' : 'var(--shadow-2)'}}
            position='relative'
            onClick={onClick}
            onMouseEnter={() => setShowEllipsis(true)}
            onMouseLeave={() => setShowEllipsis(showMenu)}
        >

            <Thumbnail pageId={pageId} />

            <DropdownMenu.Root open={showMenu} onOpenChange={setShowMenu}>

                <DropdownMenu.Trigger>
                    <IconButton
                        radius='full' size='1'
                        style={{ position: 'absolute', top: '-10px', right: '-10px',boxShadow:'var(--shadow-3)', opacity: showEllipsis ? 1 : 0 }}
                    >
                        <Ellipsis size='18' />
                    </IconButton>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content>
                    <DropdownMenu.Item onSelect={() => console.log('Duplicate')} disabled={true}>
                        <Copy size='18' />
                        Dupliquer
                    </DropdownMenu.Item>

                    <DropdownMenu.Item color='red' onSelect={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
                            editor?.deletePage(pageId)
                            logger.log('tldraw:editor', `Page ${pageId} deleted successfully`)
                        }
                    }}>
                        <Trash2 size='18' />
                        Supprimer
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
                
            </DropdownMenu.Root>

        </Box>
    )
}
