import styles from './Carousel.module.css'
import Miniature from '../Miniature/Miniature'
//import { useNav } from '@/hooks/navContext'
import { useEditor, TLPageId, track } from '@tldraw/tldraw'
import Thumbnail from '@/components/Thumbnail/Thumbnail'
import { useMemo } from 'react'
import { useNavNew } from '@/hooks/navContextNew'



function Carousel() {
    // TODO: Get rid of tldraw stuff:
    // Make the carousel component take an array of children
    // Then make a special tldraw component for children, that relies on editor stuff
    const editor = useEditor()
    const { pageIds, currentPageId, setCurrentPage } = useNavNew()

    // TODO: Update the thumbnail when new object added
    const snapshot = useMemo(() => editor.store.getSnapshot(), [editor, currentPageId]) // currentPageId so that it updates when the current page changes
    
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

export default track(Carousel)