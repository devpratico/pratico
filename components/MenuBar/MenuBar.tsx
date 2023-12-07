'use client';
import styles from './MenuBar.module.css'
import Image from 'next/image';
import logo from './pratico.svg';
import Title from './Title/Title';
import Icon from './Icon/Icon';


interface MenuBarProps {
    mode: "creation" | "animation";
}


export default function MenuBar({ mode }: MenuBarProps) {

    type element = "logo" | "title" | "play" | "pause" | "stop" | "stopwatch" | "puzzle" | "chat" | "users" | "ellipsis";
    const creationElements:  element[] = ["logo", "title", "play", "puzzle", "ellipsis"];
    const animationElements: element[] = ["logo", "title", "pause", "stop", "stopwatch", "puzzle", "chat", "users", "ellipsis"];
    const leftAreaElements:  element[] = ["logo", "title", "play", "pause", "stop"];
    const rightAreaElements: element[] = ["stopwatch", "puzzle", "chat", "users", "ellipsis"];

    const elements = mode === "creation" ? creationElements : animationElements;
    const leftElements = elements.filter((element) => leftAreaElements.includes(element));
    const rightElements = elements.filter((element) => rightAreaElements.includes(element));

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

    const componentsMap: { [key in element]: JSX.Element } = {
        "logo":         <Image className={styles.logo} src={logo} alt="Pratico" />,
        "title":        <Title {...titleProps} />,
        "play":         <Icon type="play" showLabel={true} />,
        "pause":        <Icon type="pause" showLabel={true} />,
        "stop":         <Icon type="stop" showLabel={true} />,
        "stopwatch":    <Icon type="stopwatch" showLabel={true} />,
        "puzzle":       <Icon type="puzzle" showLabel={true} />,
        "chat":         <Icon type="chat" showLabel={true} />,
        "users":        <Icon type="users" showLabel={true} />,
        "ellipsis":     <Icon type="ellipsis" showLabel={true} />
    }

    const leftAreatComponents =  leftElements.map((element)  => componentsMap[element]);
    const rightAreatComponents = rightElements.map((element) => componentsMap[element]);


    return (
        <nav className={styles.menuBarContainer}>
            {leftAreatComponents}
            <div className={styles.spacer}></div>
            {rightAreatComponents}
        </nav>
    )
}