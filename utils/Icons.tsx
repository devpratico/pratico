import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    ;

export type IconSize = "2xs" | "xs" | "sm" | "lg" | "xl";


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
}

export function getIcon(type: IconName, size?: IconSize): JSX.Element {
    let icon = iconsMap[type];
    if (size) {
        icon = React.cloneElement(icon, { size: size });
    }
    return icon;
}

