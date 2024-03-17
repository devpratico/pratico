'use client'
import LabeledIconBtn from "@/components/primitives/buttons/LabaledIconBtn/LabeledIconBtn";
import PeopleIcon from "@/components/icons/PeopleIcon";
import { IconSize } from "@/utils/icons/IconProps";
import { useUi } from "@/hooks/useUi";



export default function ParticipantsBtn({message}: {message?: string}) {

    const { toggleDeskMenu } = useUi()

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