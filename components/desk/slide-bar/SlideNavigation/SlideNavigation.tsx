'use client'
import styles from './SlideNavigation.module.css'
import LabeledIconBtn from '../../../primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon'
import { IconSize } from '@/utils/icons/IconProps';
import { useEditor } from '@tldraw/tldraw'

export default function SlideNavigation() {

    const editor = useEditor()
    const pagesNb = editor.getPages().length

    const leftArrowBtnProps = {
        icon:       <ChevronLeftIcon />,
        iconSize:   "md" as IconSize,
        label:      undefined,
        iconColor:  "var(--primary)",
        onClick: () => console.log("clicked"),
    }
    const LeftArrow = () => <LabeledIconBtn {...leftArrowBtnProps} />

    const rightArrowBtnProps = {
        icon:       <ChevronRightIcon />,
        iconSize:   "md" as IconSize,
        label:      undefined,
        iconColor:  "var(--primary)",
        onClick: () => console.log("clicked"),
    }
    const RightArrow = () => <LabeledIconBtn {...rightArrowBtnProps} />


    return (
        <div className={styles.container}>
            <LeftArrow />
            <div className={styles.counter}>
                <p className={styles.numberLeft} >1</p>
                <p className={styles.slash} >/</p>
                <p className={styles.numberRight}>{pagesNb}</p>
            </div>
            <RightArrow />
        </div>
    )
}