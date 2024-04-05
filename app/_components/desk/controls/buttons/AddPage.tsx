'use client'
import PlusSquareIcon from '@/app/_components/icons/PlusSquareIcon'
import LabeledIconBtn from '@/app/_components/primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import { IconSize } from '@/app/_utils/icons/IconProps';
import { useUi } from '@/app/_hooks/useUi';


export default function AddPage() {

    const { toggleDeskMenu } = useUi()

    const addPageBtnProps = {
        icon:       <PlusSquareIcon />,
        iconSize:   "lg" as IconSize,
        iconColor:  "var(--primary)",
        labelColor: "var(--primary-text)",
        onClick:    () => toggleDeskMenu('add'),
    }

    return <LabeledIconBtn {...addPageBtnProps} />
}