'use client'
import LabeledIconBtn from "@/app/[locale]/_components/primitives/buttons/LabaledIconBtn/LabeledIconBtn";
import PeopleIcon from "@/app/[locale]/_components/icons/PeopleIcon";
import { IconSize } from "@/app/_utils/icons/IconProps";
import { useMenu } from "../../../../../../_hooks/useMenu";



export default function ParticipantsBtn({message}: {message?: string}) {

    const { toggleDeskMenu } = useMenu()

    const styleBtnProps = {
        iconColor: "var(--text-on-primary)",
        iconSize: "md" as IconSize,
        labelColor: "var(--secondary)",
        hideLabel: false,
    }

    return (
        <LabeledIconBtn
            icon={<PeopleIcon fill={true}/>}
            label={message || 'participants'}
            onClick={() => toggleDeskMenu('participants')}
            {...styleBtnProps}
        />
    )
}