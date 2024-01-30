'use client'
import styles from './SlideBar.module.css'
import LabeledIconBtn from '../../../primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import SlideNavigation from '../SlideNavigation/SlideNavigation'
import Carousel from '../../carousel/Carousel/Carousel'
import PlusSquareIcon from '@/components/icons/PlusSquareIcon'
import FullScreenIcon from '@/components/icons/FullScreenIcon'
import { IconSize } from '@/utils/icons/IconProps';

export default function SlideBar() {

    const addPageBtnProps = {
        icon:       <PlusSquareIcon />,
        iconSize:   "lg" as IconSize,
        iconColor:  "var(--primary)",
        labelColor: "var(--primary-text)",
        onClick: () => console.log("clicked"),
    }
    const AddPage = () => <LabeledIconBtn {...addPageBtnProps} />

    const expandBtnProps = {
        icon:       <FullScreenIcon />,
        iconSize:   "md" as IconSize,
        iconColor:  "var(--primary)",
        labelColor: "var(--primary-text)",
        onClick: () => console.log("clicked"),
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