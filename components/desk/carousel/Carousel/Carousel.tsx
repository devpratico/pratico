import styles from './Carousel.module.css'
import Miniature from '../Miniature/Miniature'
import { useNav } from '@/contexts/NavContext'



export default function Carousel() {

    const { pagesIds, currentPageId, setCurrentPage } = useNav()

    return (
        <div className={styles.container}>
            {pagesIds.map((id, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(id)}
                    className={styles.miniatureBtn}
                >
                    <Miniature selected={id === currentPageId}>{i}</Miniature>
                </button>
            ))}
        </div>
    )
}