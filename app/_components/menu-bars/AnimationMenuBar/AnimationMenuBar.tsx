import styles from './AnimationMenuBar.module.css';
import MenuBarLayout from "../components/MenuBarLayout/MenuBarLayout";
import Image from 'next/image';
import LabeledIconBtn from '../../primitives/buttons/LabaledIconBtn/LabeledIconBtn';
//import praticoLogo from '../../../public/images/pratico.svg';
import PuzzleIcon from '@/app/_components/icons/PuzzleIcon';
import ThreeDotsIcon from '@/app/_components/icons/ThreeDotsIcon';
import ChatSquareDotIcon from '@/app/_components/icons/ChatSquareDotIcon';
import { IconSize } from '@/app/_utils/icons/IconProps';
import StopBtn from "./buttons/StopBtn";
import RoomLink from "../components/RoomLink/RoomLink";
import ParticipantsBtn from './buttons/ParticipantsBtn';



interface AnimationMenuBarProps {
    messages?: {
        stop: string;
        polls: string;
        chat: string;
        participants: string;
        more: string;
    }
}

export default function AnimationMenuBar({ messages }: AnimationMenuBarProps) {

    const styleBtnProps = {
        iconColor: "var(--text-on-primary)",
        iconSize: "md" as IconSize,
        labelColor: "var(--secondary)",
        hideLabel: false,
    }

    return (
        <MenuBarLayout spacerPosition={2}>
            <div className={styles.link}>
                <Image src={'/images/pratico.svg'} width={100} height={50} alt="Pratico" />
                <RoomLink />
            </div>
            <StopBtn message={messages?.stop || 'Stop Session'} />
            <LabeledIconBtn icon={<PuzzleIcon        fill={true}/>} label={messages?.polls || 'activities'} {...styleBtnProps} />
            <LabeledIconBtn icon={<ChatSquareDotIcon fill={true}/>} label={messages?.chat || 'chat'} {...styleBtnProps} />
            <ParticipantsBtn message={messages?.participants} />
            <LabeledIconBtn icon={<ThreeDotsIcon     fill={true}/>} label={messages?.more || 'more'} {...styleBtnProps} />
        </MenuBarLayout>
    )
}