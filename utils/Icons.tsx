//'use client'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
//import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css' // import Font Awesome CSS to fix icon bug
import {
    faStopwatch,
    faPuzzlePiece,
    faMessage,
    faUsers,
    faEllipsis,
    faPlay,
    faPause,
    faStop,
    faSquarePlus,
    faExpand,
    faChevronLeft,
    faChevronRight,
    faFile,
    faClockRotateLeft,
    faBook,
    faCircleQuestion,
    faGear,
    faFileLines,
    faGrip,
    faList,
    faStickyNote,
    faAlignLeft,
    faAlignRight,
    faAlignCenter,
    faHighlighter,
} from '@fortawesome/free-solid-svg-icons';

export type IconName =
    "stopwatch"
    | "puzzle"
    | "chat"
    | "users"
    | "ellipsis"
    | "play"
    | "pause"
    | "stop"
    | "square-plus"
    | "expand"
    | "chevron-left"
    | "chevron-right"
    | "file"
    | "clock-rotate-left"
    | "book"
    | "circle-question"
    | "gear"
    | "file-lines"
    | "grip"
    | "list"
    | "sticky-note"
    | "align-left"
    | "align-right"
    | "align-center"
    | "highlighter"
    ;

/*
const iconNameToIconMap: { [key: string]: FontAwesomeIconProps["icon"] } = {
    "stopwatch":    faStopwatch,
    "puzzle":       faPuzzlePiece,
    "chat":         faMessage,
    "users":        faUsers,
    "ellipsis":     faEllipsis,
    "play":         faPlay,
    "pause":        faPause,
    "stop":         faStop,
    "square-plus":  faSquarePlus,
    "expand":       faExpand,
    "chevron-left": faChevronLeft,
    "chevron-right":faChevronRight,
    "file":         faFile,
    "clock-rotate-left": faClockRotateLeft,
    "book":         faBook,
    "circle-question": faCircleQuestion,
    "gear":         faGear,
    "file-lines":   faFileLines,
    "grip":         faGrip,
    "list":         faList,
    "sticky-note":  faStickyNote,
    "align-left":   faAlignLeft,
    "align-right":  faAlignRight,
    "align-center": faAlignCenter,
    "highlighter":  faHighlighter,
}
*/



export type IconSize = SizeProp;


const iconsMap: { [key in IconName]: JSX.Element } = {
    "stopwatch":    <FontAwesomeIcon icon={faStopwatch} />,
    "puzzle":       <FontAwesomeIcon icon={faPuzzlePiece} />,
    "chat":         <FontAwesomeIcon icon={faMessage} />,
    "users":        <FontAwesomeIcon icon={faUsers} />,
    "ellipsis":     <FontAwesomeIcon icon={faEllipsis} />,
    "play":         <FontAwesomeIcon icon={faPlay} />,
    "pause":        <FontAwesomeIcon icon={faPause} />,
    "stop":         <FontAwesomeIcon icon={faStop} />,
    "square-plus":  <FontAwesomeIcon icon={faSquarePlus} />,
    "expand":       <FontAwesomeIcon icon={faExpand} />,
    "chevron-left": <FontAwesomeIcon icon={faChevronLeft} />,
    "chevron-right":<FontAwesomeIcon icon={faChevronRight} />,
    "file":         <FontAwesomeIcon icon={faFile} />,
    "clock-rotate-left": <FontAwesomeIcon icon={faClockRotateLeft} />,
    "book":         <FontAwesomeIcon icon={faBook} />,
    "circle-question": <FontAwesomeIcon icon={faCircleQuestion} />,
    "gear":         <FontAwesomeIcon icon={faGear} />,
    "file-lines":   <FontAwesomeIcon icon={faFileLines} />,
    "grip":         <FontAwesomeIcon icon={faGrip} />,
    "list":         <FontAwesomeIcon icon={faList} />,
    "sticky-note":  <FontAwesomeIcon icon={faStickyNote} />,
    "align-left":   <FontAwesomeIcon icon={faAlignLeft} />,
    "align-right":  <FontAwesomeIcon icon={faAlignRight} />,
    "align-center": <FontAwesomeIcon icon={faAlignCenter} />,
    "highlighter":  <FontAwesomeIcon icon={faHighlighter} />,
}


export function getIcon(type: IconName, size?: IconSize): JSX.Element {
    let icon = iconsMap[type];
    if (size) {
        icon = React.cloneElement(icon, { size: size });
    }
    return icon;
}

// TODO: Delete that