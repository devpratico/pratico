import Image from 'next/image';
import Title from '../Title/Title';
import LabeledIconBtn from '../../primitives/buttons/LabaledIconBtn/LabeledIconBtn';
import LabeledIcon from '../../primitives/LabeledIcon/LabeledIcon';
import MenuBarLayout from '../MenuBarLayout/MenuBarLayout';
import praticoLogo from '../../../public/images/pratico.svg';
import { IconSize } from '../../../utils/Icons';
import Modal from '../../primitives/Modal/Modal';


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
        size: "lg" as IconSize,
        labelColor: "var(--secondary)",
        hideLabel: hideLabels,
        centered: false,
    }

    switch (mode) {
        case "creation":
            return (
                <MenuBarLayout spacerPosition={3}>
                    <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
                    <Title initialValue="" placeholder="Session name" focusFirst={true} editable={true} />
                    <LabeledIconBtn type="play"         label="play"        {...styleBtnProps} />
                    <LabeledIconBtn type="puzzle"       label="polls"       {...styleBtnProps} />
                    <LabeledIconBtn type="ellipsis"     label="more"        {...styleBtnProps} />
                </MenuBarLayout>
            )

        case "animation":
            return (
                <MenuBarLayout spacerPosition={4}>
                    <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
                    <Title initialValue="My session" placeholder="Session name" focusFirst={false} editable={false} />
                    <LabeledIconBtn type="pause"        label="pause"       {...styleBtnProps} />
                    <LabeledIconBtn type="stop"         label="stop"        {...styleBtnProps} />
                    <LabeledIconBtn type="stopwatch"    label="stopwatch"   {...styleBtnProps} />
                    <LabeledIconBtn type="chat"         label="chat"        {...styleBtnProps} />
                    <LabeledIconBtn type="users"        label="students"    {...styleBtnProps} />
                    <Modal button={<LabeledIcon type="puzzle" label="polls" {...styleBtnProps} />} content={<div></div>} position="right"/>
                    <LabeledIconBtn type="ellipsis"     label="more"        {...styleBtnProps} />
                </MenuBarLayout>
            )

        case "dashboard":
            return (
                <MenuBarLayout spacerPosition={1}>
                    <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
                </MenuBarLayout>
            )
    }
}