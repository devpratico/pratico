'use client'
import styles from './SlideNavigation.module.css'
import { IconName, IconSize } from '../../../utils/Icons'
import { ColorType } from '../../../utils/Colors'
import LabeledIconBtn from '../../Primitives/Buttons/LabaledIconBtn/LabeledIconBtn'

export default function SlideNavigation() {

    const leftArrowBtnProps = {
        type:       "chevron-left" as IconName,
        label:      undefined,
        iconColor:  "var(--primary)",
        size:       "xl" as IconSize,
        onClick: () => console.log("clicked")
    }
    const LeftArrow = () => <LabeledIconBtn {...leftArrowBtnProps} />

    const rightArrowBtnProps = {
        type:       "chevron-right" as IconName,
        label:      undefined,
        iconColor:  "var(--primary)",
        size:       "xl" as IconSize,
        onClick: () => console.log("clicked")
    }
    const RightArrow = () => <LabeledIconBtn {...rightArrowBtnProps} />


    return (
        <div className={styles.container}>
            <LeftArrow />
            <div className={styles.counter}>
                <p className={styles.numberLeft} >1</p>
                <p className={styles.slash} >/</p>
                <p className={styles.numberRight} >10</p>
            </div>
            <RightArrow />
        </div>
    )
}