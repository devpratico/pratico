'use client';
import styles from './MenuBar.module.css'
import Image from 'next/image';
import logo from './pratico.svg';
import Title from './Title/Title';
import Icon from './Icon/Icon';


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
    const leftElements = elements.filter((element) => leftAreaElements.includes(element));
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

    // Each element corresponds to a component
    const componentsMap: { [key in element]: JSX.Element } = {
        "logo":         <Image className={styles.logo} src={logo} alt="Pratico" />,
        "title":        <Title {...titleProps} />,
        "play":         <Icon type="play"       hideLabel={hideLabels} onClick={handleClick}/>,
        "pause":        <Icon type="pause"      hideLabel={hideLabels} onClick={handleClick}/>,
        "stop":         <Icon type="stop"       hideLabel={hideLabels} onClick={handleClick}/>,
        "stopwatch":    <Icon type="stopwatch"  hideLabel={hideLabels} onClick={handleClick}/>,
        "puzzle":       <Icon type="puzzle"     hideLabel={hideLabels} onClick={handleClick}/>,
        "chat":         <Icon type="chat"       hideLabel={hideLabels} onClick={handleClick}/>,
        "users":        <Icon type="users"      hideLabel={hideLabels} onClick={handleClick}/>,
        "ellipsis":     <Icon type="ellipsis"   hideLabel={hideLabels} onClick={handleClick}/>
    }

    // Get the components corresponding to the elements
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