import styles from './Carousel.module.css'
import Miniature from '../Miniature/Miniature'
import { useNav } from '@/hooks/navContext'
import { useEditor, TLPageId } from '@tldraw/tldraw'
import Thumbnail from '@/components/Thumbnail/Thumbnail'



export default function Carousel() {

    const { pagesIds, currentPageId, setCurrentPage } = useNav()

    // TODO: Maybe get rid of tldraw stuff:
    // Make the carousel component take an array of children
    // Then make a special tldraw component that relies on editor stuff
    const editor = useEditor()
    const snapshot = editor.store.getSnapshot()

    return (
        <div className={styles.container}>
            {pagesIds.map((id, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(id)}
                    className={styles.miniatureBtn}
                >
                    <Miniature selected={id === currentPageId}>
                        <Thumbnail snapshot={snapshot} pageId={id as TLPageId} />
                    </Miniature>
                </button>
            ))}
        </div>
    )
}