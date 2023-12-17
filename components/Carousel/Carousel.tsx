import styles from './Carousel.module.css'
import Miniature from './Miniature/Miniature'


export default function Carousel() {

    const miniatures = [
        <Miniature selected={true} key={1}/>,
        <Miniature key={2}/>,
        <Miniature key={3}/>,
    ]

    return (
        <div className={styles.container}>
            {miniatures.map((miniature, i) => (<div key={i}>{miniature}</div>))}
        </div>
    )
}