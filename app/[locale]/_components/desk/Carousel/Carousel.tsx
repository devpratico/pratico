'use client'
import Thumbnail from '@/app/[locale]/_components/Thumbnail/Thumbnail'
import { useMemo, useState } from 'react'
import { useNav } from '@/app/[locale]/_hooks/useNav'
import { useTLEditor } from '@/app/[locale]/_hooks/useTLEditor'
import { Card, Flex, ScrollArea, DropdownMenu, IconButton } from '@radix-ui/themes'
import { Ellipsis, Trash2, Copy } from 'lucide-react'
import { TLPageId } from 'tldraw'


interface MiniatureProps {
    key: string
    snapshot: any
    pageId: TLPageId
    selected: boolean
    onClick: () => void
}


export default function Carousel() {
    const { editor } = useTLEditor()
    const { pageIds, currentPageId, setCurrentPage } = useNav()

    // TODO: Update the thumbnail when new object added
    const snapshot = useMemo(() => editor?.store?.getSnapshot(), [editor]) // currentPageId so that it updates when the current page changes

    if ( !(editor && pageIds && currentPageId && setCurrentPage && snapshot) ) {
        return <></> // TODO: Make a loading animation
    }
    
    return (
        <ScrollArea scrollbars='horizontal'>
            <Flex p='3' gap='3' align='stretch'  style={{height:'100%', overflow:'hidden'}}>
                {pageIds.map((id, i) => (
                    <Miniature
                        key={id}
                        snapshot={snapshot}
                        pageId={id}
                        selected={currentPageId === id}
                        onClick={() => setCurrentPage(id)}
                    />
                ))}
            </Flex>
        </ScrollArea>
    )
}


function Miniature({key, snapshot, pageId, selected, onClick}: MiniatureProps) {
    const [showEllipsis, setShowEllipsis] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    
    const selectedStyle = { boxShadow: '0 0 0 3px var(--primary)' };
    const outlineStyle = selected ? selectedStyle : {}

    return (
        <Card
            key={key}
            variant='classic'
            style={{aspectRatio:'16/9', height: '100%', padding:'0', ...outlineStyle}}
            onClick={onClick}
            onMouseEnter={() => setShowEllipsis(true)}
            onMouseLeave={() => {setShowEllipsis(false); setShowMenu(false) }}
        >
            <Thumbnail snapshot={snapshot} pageId={pageId} />

            <DropdownMenu.Root open={showMenu} onOpenChange={setShowMenu}>

                <DropdownMenu.Trigger>
                    <IconButton m='1' radius='full' size='1' variant='soft' style={{ position: 'absolute', top: '0', right: '0', display: showEllipsis ? 'flex' : 'none' }}>
                        <Ellipsis size='18' />
                    </IconButton>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content>
                    <DropdownMenu.Item onSelect={() => console.log('Duplicate')} disabled={true}>
                        <Copy size='18' />
                        Dupliquer
                    </DropdownMenu.Item>

                    <DropdownMenu.Item color='red' onSelect={() => console.log('Delete')}>
                        <Trash2 size='18' />
                        Supprimer
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>

        </Card>    
    )
}

