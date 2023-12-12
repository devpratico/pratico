'use client';
import styles from './MenuBar.module.css'
import Image from 'next/image';
import Title from './Title/Title';
import LabeledIconBtn from '../Buttons/LabaledIconBtn/LabeledIconBtn';
import { ColorType } from '@/utils/Colors';
import MenuBarLayout from './MenuBarLayout/MenuBarLayout';


interface MenuBarProps {
    mode: "creation" | "animation" | "dashboard";
    hideLabels?: boolean;
}


export default function MenuBar({ mode, hideLabels }: MenuBarProps) {

    const styleBtnProps = {
        iconColor: "white" as ColorType,
        labelColor: "violet-lighter" as ColorType,
        hideLabel: hideLabels
    }

    switch (mode) {
        case "creation":
            return (
                <MenuBarLayout spacerPosition={3}>
                    <Image src='/pratico.svg' width={100} height={50} alt="Pratico" />
                    <Title initialValue="" placeholder="Session name" focusFirst={true} editable={true} />
                    <LabeledIconBtn type="play"         label="play"        {...styleBtnProps} />
                    <LabeledIconBtn type="stopwatch"    label="stopwatch"   {...styleBtnProps} />
                    <LabeledIconBtn type="ellipsis"     label="more"        {...styleBtnProps} />
                </MenuBarLayout>
            )

        case "animation":
            return (
                <MenuBarLayout spacerPosition={4}>
                    <Image src='/pratico.svg' width={100} height={50} alt="Pratico" />
                    <Title initialValue="My session" placeholder="Session name" focusFirst={false} editable={false} />
                    <LabeledIconBtn type="pause"        label="pause"       {...styleBtnProps} />
                    <LabeledIconBtn type="stop"         label="stop"        {...styleBtnProps} />
                    <LabeledIconBtn type="stopwatch"    label="stopwatch"   {...styleBtnProps} />
                    <LabeledIconBtn type="chat"         label="chat"        {...styleBtnProps} />
                    <LabeledIconBtn type="users"        label="students"    {...styleBtnProps} />
                    <LabeledIconBtn type="ellipsis"     label="more"        {...styleBtnProps} />
                </MenuBarLayout>
            )

        case "dashboard":
            return (
                <MenuBarLayout spacerPosition={1}>
                    <Image src='/pratico.svg' width={100} height={50} alt="Pratico" />
                    <LabeledIconBtn type="ellipsis"     label="more"        {...styleBtnProps} />
                </MenuBarLayout>
            )
    }
}