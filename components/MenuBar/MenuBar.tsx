'use client';
import styles from './MenuBar.module.css'
import Image from 'next/image';
import Title from './Title/Title';
import LabeledIconBtn from '../Buttons/LabaledIconBtn/LabeledIconBtn';
import { ColorType } from '@/utils/Colors';


interface MenuBarProps {
    mode: "creation" | "animation";
    hideLabels?: boolean;
}


export default function MenuBar({ mode, hideLabels }: MenuBarProps) {

    type element = "logo" | "title" | "play" | "pause" | "stop" | "stopwatch" | "puzzle" | "chat" | "users" | "ellipsis";

    // Define what elements to show depending on the mode
    const creationElements:  element[] = ["logo", "title", "play", "puzzle", "ellipsis"];
    const animationElements: element[] = ["logo", "title", "pause", "stop", "stopwatch", "puzzle", "chat", "users", "ellipsis"];

    // Define where elements should be placed
    const leftAreaElements:  element[] = ["logo", "title", "play", "pause", "stop"];
    const rightAreaElements: element[] = ["stopwatch", "puzzle", "chat", "users", "ellipsis"];

    // Actually choosing what elements to show
    const elements = mode === "creation" ? creationElements : animationElements;

    // Splitting elements into left and right areas
    const leftElements =  elements.filter((element) => leftAreaElements.includes(element));
    const rightElements = elements.filter((element) => rightAreaElements.includes(element));

    // The title components behaves differently depending on the mode
    const creationTitleProps = {
        initialValue: "",
        placeholder: "Session name",
        focusFirst: true,
        editable: true
    }
    const animationTitleProps = {
        initialValue: "My session",
        placeholder: "Session name",
        focusFirst: false,
        editable: false
    }

    const titleProps = mode === "creation" ? creationTitleProps : animationTitleProps;

    const handleClick = () => {
        console.log("clicked");
    }

    const labeledIconBtnProps = {
        iconColor: "white" as ColorType,
        labelColor: "violet-lighter" as ColorType,
        onClick: handleClick
    }

    // Each element corresponds to a component
    const componentsMap: { [key in element]: JSX.Element } = {
        "logo":         <Image src='/pratico.svg' width={100} height={50} alt="Pratico" />,
        "title":        <Title {...titleProps} />,
        "play":         <LabeledIconBtn type="play"      label={"play"}     {...labeledIconBtnProps} />,
        "pause":        <LabeledIconBtn type="pause"     label={"pause"}    {...labeledIconBtnProps} />,
        "stop":         <LabeledIconBtn type="stop"      label={"stop"}     {...labeledIconBtnProps} />,
        "stopwatch":    <LabeledIconBtn type="stopwatch" label={"stopwatch"}{...labeledIconBtnProps} />,
        "puzzle":       <LabeledIconBtn type="puzzle"    label={"polls"}    {...labeledIconBtnProps} />,
        "chat":         <LabeledIconBtn type="chat"      label={"chat"}     {...labeledIconBtnProps} />,
        "users":        <LabeledIconBtn type="users"     label={"students"} {...labeledIconBtnProps} />,
        "ellipsis":     <LabeledIconBtn type="ellipsis"  label={"more"}     {...labeledIconBtnProps} />
    }

    // Get the components corresponding to the elements
    const leftAreatComponents  = leftElements.map( (element) => componentsMap[element]);
    const rightAreatComponents = rightElements.map((element) => componentsMap[element]);

    // Set key to avoid warning
    const leftAreatComponentsWithKeys  = leftAreatComponents.map( (component, index) => <div key={index}>{component}</div>);
    const rightAreatComponentsWithKeys = rightAreatComponents.map((component, index) => <div key={index}>{component}</div>);


    return (
        <nav className={styles.menuBarContainer}>
            {leftAreatComponentsWithKeys}
            <div className={styles.spacer}></div>
            {rightAreatComponentsWithKeys}
        </nav>
    )
}