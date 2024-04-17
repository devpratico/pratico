'use client'
import Thumbnail from '@/app/[locale]/_components/Thumbnail/Thumbnail'
import { useMemo } from 'react'
import { useNav } from '@/app/[locale]/_hooks/useNav'
import { useTLEditor } from '@/app/[locale]/_hooks/useTLEditor'
import { Card, Flex, ScrollArea } from '@radix-ui/themes'



function Carousel() {
    const { editor } = useTLEditor()
    const { pageIds, currentPageId, setCurrentPage } = useNav()

    // TODO: Update the thumbnail when new object added
    const snapshot = useMemo(() => editor?.store?.getSnapshot(), [editor]) // currentPageId so that it updates when the current page changes

    if ( !(editor && pageIds && currentPageId && setCurrentPage && snapshot) ) {
        return <></> // TODO: Make a loading animation
    }

    const selectedStyle = {border:'3px solid var(--primary)'}
    
    return (
        <ScrollArea scrollbars='horizontal'>
            <Flex p='3' gap='3' align='stretch'  style={{height:'100%', overflow:'hidden'}}>
                {
                    pageIds.map((id, i) => {

                        const outlineStyle = currentPageId === id ? selectedStyle : {}

                        return (
                            <Card
                                key={i}
                                variant='classic'
                                style={{aspectRatio:'16/9', padding:'0', ...outlineStyle}}
                                onClick={() => setCurrentPage(id)}
                            >
                                <Thumbnail snapshot={snapshot} pageId={id} />
                            </Card>
                        )
                    })
                }
            </Flex>
        </ScrollArea>
        
    )
}

export default Carousel