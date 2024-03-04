'use client'
import PlusSquareIcon from '@/components/icons/PlusSquareIcon'
import LabeledIconBtn from '@/components/primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import { IconSize } from '@/utils/icons/IconProps';
import { useNav } from '@/hooks_i/navContext';



export default function AddPage() {

    const { createPage } = useNav()

    const addPageBtnProps = {
        icon:       <PlusSquareIcon />,
        iconSize:   "lg" as IconSize,
        iconColor:  "var(--primary)",
        labelColor: "var(--primary-text)",
        onClick:    () => createPage(),
    }

    return <LabeledIconBtn {...addPageBtnProps} />
}