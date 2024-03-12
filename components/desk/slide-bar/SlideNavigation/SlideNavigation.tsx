'use client'
import styles from './SlideNavigation.module.css'
import LabeledIconBtn from '../../../primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon'
import { IconSize } from '@/utils/icons/IconProps';
import { useNav } from '@/hooks/useNav'


export default function SlideNavigation() {

    /*
    const {
        pagesIds,
        currentPageId,
        incrementCurrentPageIndex,
        decrementCurrentPageIndex,
    } = useNav()
    */

    const {
        pageIds,
        currentPageId,
        goNextPage,
        goPrevPage,
    } = useNav()

    const leftArrowBtnProps = {
        icon:       <ChevronLeftIcon />,
        iconSize:   "md" as IconSize,
        label:      undefined,
        iconColor:  "var(--primary)",
        //onClick:    decrementCurrentPageIndex,
        onClick:    goPrevPage,
    }
    const LeftArrow = () => <LabeledIconBtn {...leftArrowBtnProps} />

    const rightArrowBtnProps = {
        icon:       <ChevronRightIcon />,
        iconSize:   "md" as IconSize,
        label:      undefined,
        iconColor:  "var(--primary)",
        onClick:    goNextPage,
    }
    const RightArrow = () => <LabeledIconBtn {...rightArrowBtnProps} />

    const leftNumber = pageIds && currentPageId ? Array.from(pageIds).indexOf(currentPageId) + 1 : 0
    const rightNumber = pageIds ? Array.from(pageIds).length : 0


    return (
        <div className={styles.container}>
            <LeftArrow />
            <div className={styles.counter}>
                <p className={styles.numberLeft}>{leftNumber}</p>
                <p className={styles.slash} >/</p>
                <p className={styles.numberRight}>{rightNumber}</p>
            </div>
            <RightArrow />
        </div>
    )
}