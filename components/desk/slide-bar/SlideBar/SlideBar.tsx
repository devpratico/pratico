import styles from './SlideBar.module.css'
import LabeledIconBtn from '../../../primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import SlideNavigation from '../SlideNavigation/SlideNavigation'
import Carousel from '../../carousel/Carousel/Carousel'
import FullScreenIcon from '@/components/icons/FullScreenIcon'
import { IconSize } from '@/utils/icons/IconProps';
import AddPage from './buttons/AddPage'


export default function SlideBar() {

    const expandBtnProps = {
        icon:       <FullScreenIcon />,
        iconSize:   "md" as IconSize,
        iconColor:  "var(--primary)",
        labelColor: "var(--primary-text)",
        //onClick: () => console.log("clicked"),
    }
    const Expand = () => <LabeledIconBtn {...expandBtnProps} />

    return (
        <div className={styles.container}>

            <div className={styles.carouselContainer}>
                <Carousel />
            </div>

            <div className={styles.controls}>
                <AddPage />
                <SlideNavigation />
                <Expand />
            </div>
        </div>
    )
}