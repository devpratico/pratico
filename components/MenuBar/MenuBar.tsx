'use client';

import styles from './MenuBar.module.css'
import Image from 'next/image';
import logo from './pratico.svg';
import Title from './Title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';


interface MenuBarProps {
    mode: "creation" | "animation";
}


export default function MenuBar({ mode }: MenuBarProps) {

    type element = "logo" | "title" | "control" | "stopwatch" | "puzzle" | "chat" | "users" | "ellipsis";
    const creationElements:  element[] = ["logo", "title", "control", "puzzle", "ellipsis"];
    const animationElements: element[] = ["logo", "title", "control", "stopwatch", "puzzle", "chat", "users", "ellipsis"];
    const leftAreaElements:  element[] = ["logo", "title", "control"];
    const rightAreaElements: element[] = ["stopwatch", "puzzle", "chat", "users", "ellipsis"];

    const elements = mode === "creation" ? creationElements : animationElements;
    const leftElements = elements.filter((element) => leftAreaElements.includes(element));
    const rightElements = elements.filter((element) => rightAreaElements.includes(element));

    const creationTitleProps = {
        initialValue: "Untitled",
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
        "control":      <FontAwesomeIcon icon={faPlay} />,
        "stopwatch":    <FontAwesomeIcon icon={faStopwatch} />,
        "puzzle":       <FontAwesomeIcon icon={faPuzzlePiece} />,
        "chat":         <FontAwesomeIcon icon={faMessage} />,
        "users":        <FontAwesomeIcon icon={faUsers} />,
        "ellipsis":     <FontAwesomeIcon icon={faEllipsis} />
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