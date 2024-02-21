import styles from './MenuBar.module.css';
import Image from 'next/image';
import CapsuleTitle from '../CapsuleTitle/CapsuleTitle';
import LabeledIconBtn from '../../primitives/buttons/LabaledIconBtn/LabeledIconBtn';
import LabeledIcon from '../../primitives/LabeledIcon/LabeledIcon';
import MenuBarLayout from '../MenuBarLayout/MenuBarLayout';
import { IconSize } from '@/utils/icons/IconProps';
import praticoLogo from '../../../public/images/pratico.svg';
import PuzzleIcon from '@/components/icons/PuzzleIcon';
import ThreeDotsIcon from '@/components/icons/ThreeDotsIcon';
//import PlayCircleIcon from '@/components/icons/PlayCircleIcon';
//import PauseCircleIcon from '@/components/icons/PauseCircleIcon';
//import StopCircleIcon from '@/components/icons/StopCircleIcon';
//import StopwatchIcon from '@/components/icons/StopwatchIcon';
import ChatSquareDotIcon from '@/components/icons/ChatSquareDotIcon';
import PeopleIcon from '@/components/icons/PeopleIcon';
import PlainBtn from '@/components/primitives/buttons/PlainBtn/PlainBtn';
import UserInfo from '../UserInfo/UserInfo';
import { getTranslations } from 'next-intl/server';
import SaveBtn from '../buttons/SaveBtn';



interface MenuBarProps {
    mode: "creation" | "animation" | "dashboard";
    hideLabels?: boolean;
    capsuleId?: string;
}

/**
 * This component uses the `MenuBarLayout` component to render a menu bar with the appropriate buttons for the specified mode.
 */
export default async function MenuBar({ mode, hideLabels, capsuleId }: MenuBarProps) {

    const t = await getTranslations("menu-bar");

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
                    <CapsuleTitle capsuleId={capsuleId} />
                    <PlainBtn color="secondary" size="m">{t('play')}</PlainBtn>
                    <LabeledIconBtn icon={<PuzzleIcon/>}      label={t('polls')} {...styleBtnProps} />
                    <LabeledIconBtn icon={<ThreeDotsIcon/>}   label={t('more')} {...styleBtnProps} />
                    <SaveBtn capsuleId={capsuleId}/>
                </MenuBarLayout>
            )
            

        case "animation":
            return (
                <MenuBarLayout spacerPosition={3}>
                    <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
                    <CapsuleTitle capsuleId={capsuleId} />
                    <PlainBtn color="secondary" size="m">Start Session</PlainBtn>
                    <LabeledIcon    icon={<PuzzleIcon        fill={true}/>} label={t('polls')}      {...styleBtnProps} />
                    <LabeledIconBtn icon={<ChatSquareDotIcon fill={true}/>} label={t('chat')}      {...styleBtnProps} />
                    <LabeledIconBtn icon={<PeopleIcon        fill={true}/>} label={t('participants')}   {...styleBtnProps} />
                    <LabeledIconBtn icon={<ThreeDotsIcon     fill={true}/>} label={t('more')}       {...styleBtnProps} />
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