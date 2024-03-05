import styles from './AnimationMenuBar.module.css';
import MenuBarLayout from "../components/MenuBarLayout/MenuBarLayout";
import Image from 'next/image';
import LabeledIconBtn from '../../primitives/buttons/LabaledIconBtn/LabeledIconBtn';
import LabeledIcon from '../../primitives/LabeledIcon/LabeledIcon';
import praticoLogo from '../../../public/images/pratico.svg';
import PuzzleIcon from '@/components/icons/PuzzleIcon';
import ThreeDotsIcon from '@/components/icons/ThreeDotsIcon';
import ChatSquareDotIcon from '@/components/icons/ChatSquareDotIcon';
import PeopleIcon from '@/components/icons/PeopleIcon';
import { IconSize } from '@/utils/icons/IconProps';
import StopBtn from "./buttons/StopBtn";
import RoomLink from "../components/RoomLink/RoomLink";



interface AnimationMenuBarProps {
    capsuleId?: string;
    messages?: {
        stop: string;
        polls: string;
        chat: string;
        participants: string;
        more: string;
    }
}

export default function AnimationMenuBar({ capsuleId, messages }: AnimationMenuBarProps) {

    const styleBtnProps = {
        iconColor: "var(--text-on-primary)",
        iconSize: "md" as IconSize,
        labelColor: "var(--secondary)",
        hideLabel: false,
    }

    return (
        <MenuBarLayout spacerPosition={3}>
            <div className={styles.link}>
                <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
                <RoomLink />
            </div>
            <StopBtn message={messages?.stop || 'Stop Session'} />
            <LabeledIcon    icon={<PuzzleIcon        fill={true}/>} label={messages?.polls || 'activities'} {...styleBtnProps} />
            <LabeledIconBtn icon={<ChatSquareDotIcon fill={true}/>} label={messages?.chat || 'chat'} {...styleBtnProps} />
            <LabeledIconBtn icon={<PeopleIcon        fill={true}/>} label={messages?.participants || 'participants'} {...styleBtnProps} />
            <LabeledIconBtn icon={<ThreeDotsIcon     fill={true}/>} label={messages?.more || 'more'} {...styleBtnProps} />
        </MenuBarLayout>
    )
}