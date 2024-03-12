'use client'
import PlusSquareIcon from '@/components/icons/PlusSquareIcon'
import LabeledIconBtn from '@/components/primitives/buttons/LabaledIconBtn/LabeledIconBtn'
import { IconSize } from '@/utils/icons/IconProps';
import { useUi } from '@/hooks/useUi';


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