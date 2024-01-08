'use client'
import styles from './SlideBar.module.css'
import LabeledIconBtn from '../../../primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import { IconName, IconSize } from '../../../../utils/Icons'
import SlideNavigation from '../SlideNavigation/SlideNavigation'
import Carousel from '../../carousel/Carousel/Carousel'

export default function SlideBar() {

    const addPageBtnProps = {
        type:       "square-plus" as IconName,
        label:      "add",
        iconColor:  "var(--primary)",
        labelColor: "var(--primary-text)",
        size:       "xl" as IconSize,
        centered:   true,
        onClick: () => console.log("clicked")
    }
    const AddPage = () => <LabeledIconBtn {...addPageBtnProps} />

    const expandBtnProps = {
        type:       "expand" as IconName,
        label:      "full screen",
        iconColor:  "var(--primary)",
        labelColor: "var(--primary-text)",
        size:       "lg" as IconSize,
        centered:   true,
        onClick: () => console.log("clicked")
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