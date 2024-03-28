'use client'
import styles from './Carousel.module.css'
import Miniature from '../Miniature/Miniature'
import Thumbnail from '@/components/Thumbnail/Thumbnail'
import { useMemo } from 'react'
import { useNav } from '@/hooks/useNav'
import { useTLEditor } from '@/hooks/useTLEditor'



function Carousel() {
    const { editor } = useTLEditor()
    const { pageIds, currentPageId, setCurrentPage } = useNav()

    // TODO: Update the thumbnail when new object added
    const snapshot = useMemo(() => editor?.store?.getSnapshot(), [editor]) // currentPageId so that it updates when the current page changes

    if ( !(editor && pageIds && currentPageId && setCurrentPage && snapshot) ) {
        return <></> // TODO: Make a loading animation
    }

    
    // TODO: When the selected page is not visible, scroll to it
    return (
        <div className={styles.container}>
            {pageIds.map((id, i) => (
                <div // I would use a button here, but it's messing up the flexbox
                    key={i}
                    onClick={() => setCurrentPage(id)}
                    className={styles.miniatureBtn}
                >
                    <Miniature selected={id === currentPageId}>
                        <Thumbnail snapshot={snapshot} pageId={id} />
                    </Miniature>
                </div>
            ))}
        </div>
    )
}

export default Carousel