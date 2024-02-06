import styles from './MenuBar.module.css';
import Image from 'next/image';
import Title from '../Title/Title';
import LabeledIconBtn from '../../primitives/buttons/LabaledIconBtn/LabeledIconBtn';
import LabeledIcon from '../../primitives/LabeledIcon/LabeledIcon';
import MenuBarLayout from '../MenuBarLayout/MenuBarLayout';
import { IconSize } from '@/utils/icons/IconProps';
import praticoLogo from '../../../public/images/pratico.svg';
import PlayCircleIcon from '@/components/icons/PlayCircleIcon';
import PuzzleIcon from '@/components/icons/PuzzleIcon';
import ThreeDotsIcon from '@/components/icons/ThreeDotsIcon';
//import PauseCircleIcon from '@/components/icons/PauseCircleIcon';
//import StopCircleIcon from '@/components/icons/StopCircleIcon';
//import StopwatchIcon from '@/components/icons/StopwatchIcon';
import ChatSquareDotIcon from '@/components/icons/ChatSquareDotIcon';
import PeopleIcon from '@/components/icons/PeopleIcon';
import PlainBtn from '@/components/primitives/buttons/PlainBtn/PlainBtn';
import UserInfo from '../UserInfo/UserInfo';



interface MenuBarProps {
    mode: "creation" | "animation" | "dashboard";
    hideLabels?: boolean;
}

/**
 * This component uses the `MenuBarLayout` component to render a menu bar with the appropriate buttons for the specified mode.
 */
export default function MenuBar({ mode, hideLabels }: MenuBarProps) {

    const styleBtnProps = {
        iconColor: "var(--text-on-primary)",
        iconSize: "md" as IconSize,
        labelColor: "var(--secondary)",
        hideLabel: hideLabels,
        className: styles.btn
    }

    switch (mode) {
        case "creation":
            return (
                <MenuBarLayout spacerPosition={3}>
                    <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
                    <Title initialValue="" placeholder="Session name" focusFirst={true} editable={true} />
                    <LabeledIconBtn icon={<PlayCircleIcon/>}  label="play"        {...styleBtnProps} />
                    <LabeledIconBtn icon={<PuzzleIcon/>}      label="polls"       {...styleBtnProps} />
                    <LabeledIconBtn icon={<ThreeDotsIcon/>}   label="more"        {...styleBtnProps} />
                </MenuBarLayout>
            )
            

        case "animation":
            return (
                <MenuBarLayout spacerPosition={3}>
                    <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
                    <Title initialValue="My session" placeholder="Session name" focusFirst={false} editable={false} />
                    <PlainBtn text="Start session" color="secondary" size="l" />
                    <LabeledIcon    icon={<PuzzleIcon        fill={true}/>} label="polls"     {...styleBtnProps} />
                    <LabeledIconBtn icon={<ChatSquareDotIcon fill={true}/>} label="chat"      {...styleBtnProps} />
                    <LabeledIconBtn icon={<PeopleIcon        fill={true}/>} label="students"  {...styleBtnProps} />
                    <LabeledIconBtn icon={<ThreeDotsIcon     fill={true}/>} label="more"      {...styleBtnProps} />
                </MenuBarLayout>
            )

        case "dashboard":
            return (
                <MenuBarLayout spacerPosition={1}>
                    <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
                    <UserInfo/>
                </MenuBarLayout>
            )
    }
}