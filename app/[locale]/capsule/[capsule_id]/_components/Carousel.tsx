'use client'
import Thumbnail from '@/app/[locale]/_components/Thumbnail'
import { useMemo, useState } from 'react'
import { useNav } from '@/app/[locale]/_hooks/useNav'
import { useTLEditor } from '@/app/[locale]/_hooks/useTLEditor'
import { Card, Flex, ScrollArea, DropdownMenu, IconButton } from '@radix-ui/themes'
import { Ellipsis, Trash2, Copy } from 'lucide-react'
import { TLPageId } from 'tldraw'
import logger from '@/app/_utils/logger'
import { useDisable } from '@/app/[locale]/_hooks/useDisable'


interface MiniatureProps {
    snapshot: any
    pageId: TLPageId
    selected: boolean
    onClick: () => void
}


export default function Carousel() {
    const { editor } = useTLEditor()
    const { pageIds, currentPageId, setCurrentPage } = useNav()
    const { disabled } = useDisable()

    // TODO: Update the thumbnail when new object added
    //const snapshot = useMemo(() => editor?.store?.getSnapshot(), [editor]) // currentPageId so that it updates when the current page changes
    const snapshot = editor?.store?.getSnapshot()

    /*
    editor?.sideEffects.registerAfterChangeHandler(''
        console.log('Document changed')
    })*/

    if ( !(editor && pageIds && currentPageId && setCurrentPage && snapshot) ) {
        return <></> // TODO: Make a loading animation
    }
    
    return (
        <ScrollArea scrollbars='horizontal'>
            <Flex p='3' gap='3' align='stretch' style={{height:'70px'}}>
                {pageIds.map((id, i) => (
                    <div key={`${i}`} style={{ aspectRatio: '16/9', height:'100%'}}>
                        <Miniature
                            snapshot={snapshot}
                            pageId={id}
                            selected={currentPageId === id}
                            onClick={() => { if (!disabled) setCurrentPage(id) }}
                        />
                    </div>
                ))}
            </Flex>
        </ScrollArea>
    )
}


function Miniature({snapshot, pageId, selected, onClick}: MiniatureProps) {
    const [showEllipsis, setShowEllipsis] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const { editor } = useTLEditor()
    const { disabled } = useDisable()

    const selectedStyle = { boxShadow: '0 0 0 3px var(--primary)' };
    const outlineStyle = selected ? selectedStyle : {}
    const cursorStyle = { cursor: disabled ? 'not-allowed' : 'pointer'}

    function deletePage() {
        editor?.deletePage(pageId)
    }

    return (
        <Card
            variant='classic'
            style={{ padding: '0', height:'100%', ...outlineStyle, ...cursorStyle }}
            onClick={onClick}
            onMouseEnter={() => setShowEllipsis(true)}
            onMouseLeave={() => {setShowEllipsis(false); setShowMenu(false) }}
        >
            <Thumbnail snapshot={snapshot} pageId={pageId} />


            <DropdownMenu.Root open={showMenu} onOpenChange={setShowMenu}>

                <DropdownMenu.Trigger>
                    <IconButton m='1' radius='full' size='1' style={{ position: 'absolute', top: '0', right: '0', display: showEllipsis ? 'flex' : 'none' }}>
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
                            deletePage()
                            logger.log('tldraw:editor', `Page ${pageId} deleted successfully`)
                        }}
                    }>
                        <Trash2 size='18' />
                        Supprimer
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>


        </Card>    
    )
}

