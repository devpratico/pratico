import MenuBarLayout from "../components/MenuBarLayout/MenuBarLayout";
import Image from 'next/image';
import CapsuleTitle from '../components/CapsuleTitle/CapsuleTitle';
import LabeledIconBtn from '../../primitives/buttons/LabaledIconBtn/LabeledIconBtn';
import DoneBtn from './buttons/DoneBtn';
import { IconSize } from '@/utils/icons/IconProps';
import praticoLogo from '../../../public/images/pratico.svg';
import PuzzleIcon from '@/components/icons/PuzzleIcon';
import ThreeDotsIcon from '@/components/icons/ThreeDotsIcon';
import StartBtn from "./buttons/StartBtn";



interface CreationMenuBarProps {
    messages?: {
        play: string;
        polls: string;
        more: string;
        done: string;
    }
}

export default function CreationMenuBar({ messages }: CreationMenuBarProps) {

    const styleBtnProps = {
        iconColor: "var(--text-on-primary)",
        iconSize: "md" as IconSize,
        labelColor: "var(--secondary)",
        hideLabel: false,
    }

    return (
        <MenuBarLayout spacerPosition={3}>
            <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
            <CapsuleTitle />
            <StartBtn message={messages?.play || 'Play'} />
            <LabeledIconBtn icon={<PuzzleIcon/>} label={messages?.polls || 'activities'} {...styleBtnProps} />
            <LabeledIconBtn icon={<ThreeDotsIcon/>} label={messages?.more || 'more'} {...styleBtnProps} />
            <DoneBtn message={messages?.done || 'Done'} />
        </MenuBarLayout>
    )
}