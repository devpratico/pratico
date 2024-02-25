import styles from './Carousel.module.css'
import Miniature from '../Miniature/Miniature'
import { useNav } from '@/contexts/NavContext'
import { useEditor, TldrawImage, TLPageId } from '@tldraw/tldraw'



export default function Carousel() {

    const { pagesIds, currentPageId, setCurrentPage } = useNav()
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
                        <TldrawImage
                            snapshot={snapshot}
                            pageId={id as TLPageId}
                        />
                    </Miniature>
                </button>
            ))}
        </div>
    )
}