'use client'
import styles from './Controls.module.css'
import AddPage from "../buttons/AddPage"
import LabeledIconBtn from "@/app/[locale]/_components/primitives/buttons/LabaledIconBtn/LabeledIconBtn"
import FullScreenIcon from "@/app/[locale]/_components/icons/FullScreenIcon"
import ChevronRightIcon from '@/app/[locale]/_components/icons/ChevronRightIcon'
import ChevronLeftIcon from '@/app/[locale]/_components/icons/ChevronLeftIcon'
import { IconSize } from '@/app/_utils/icons/IconProps';
import { useNav } from '@/app/[locale]/_hooks/useNav'
import { useEffect } from 'react'


export default function Controls() {

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

    const expandBtnProps = {
        icon:       <FullScreenIcon />,
        iconSize:   "md" as IconSize,
        iconColor:  "var(--primary)",
        labelColor: "var(--primary-text)",
    }
    const Expand = () => <LabeledIconBtn {...expandBtnProps} />

    const leftNumber  = pageIds && currentPageId ? Array.from(pageIds).indexOf(currentPageId) + 1 : 0
    const rightNumber = pageIds ? Array.from(pageIds).length : 0

    return (
        <div className={styles.controls}>
            <AddPage />
            <LeftArrow />
            <div className={styles.counter}>
                <p className={styles.numberLeft}>{leftNumber}</p>
                <p className={styles.slash} >/</p>
                <p className={styles.numberRight}>{rightNumber}</p>
            </div>
            <RightArrow />
            <Expand />
        </div>
    )
}