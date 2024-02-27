'use client'
import styles from './SlideNavigation.module.css'
import LabeledIconBtn from '../../../primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon'
import { IconSize } from '@/utils/icons/IconProps';
import { useNav } from '@/hooks/NavContext'


export default function SlideNavigation() {

    const {
        pagesIds,
        currentPageId,
        incrementCurrentPageIndex,
        decrementCurrentPageIndex,
    } = useNav()

    const leftArrowBtnProps = {
        icon:       <ChevronLeftIcon />,
        iconSize:   "md" as IconSize,
        label:      undefined,
        iconColor:  "var(--primary)",
        onClick:    decrementCurrentPageIndex,
    }
    const LeftArrow = () => <LabeledIconBtn {...leftArrowBtnProps} />

    const rightArrowBtnProps = {
        icon:       <ChevronRightIcon />,
        iconSize:   "md" as IconSize,
        label:      undefined,
        iconColor:  "var(--primary)",
        onClick:    incrementCurrentPageIndex,
    }
    const RightArrow = () => <LabeledIconBtn {...rightArrowBtnProps} />


    return (
        <div className={styles.container}>
            <LeftArrow />
            <div className={styles.counter}>
                <p className={styles.numberLeft}>{pagesIds.indexOf(currentPageId) + 1}</p>
                <p className={styles.slash} >/</p>
                <p className={styles.numberRight}>{pagesIds.length}</p>
            </div>
            <RightArrow />
        </div>
    )
}