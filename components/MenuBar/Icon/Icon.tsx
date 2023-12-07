import styles from './Icon.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faStop } from '@fortawesome/free-solid-svg-icons';

interface IconProps {
    type: "stopwatch" | "puzzle" | "chat" | "users" | "ellipsis" | "play" | "pause" | "stop";
    showLabel?: boolean;
}

export default function Icon({ type, showLabel }: IconProps) {

    const iconMap: { [key in IconProps["type"]]: JSX.Element } = {
        "stopwatch": <FontAwesomeIcon icon={faStopwatch} />,
        "puzzle":    <FontAwesomeIcon icon={faPuzzlePiece} />,
        "chat":      <FontAwesomeIcon icon={faMessage} />,
        "users":     <FontAwesomeIcon icon={faUsers} />,
        "ellipsis":  <FontAwesomeIcon icon={faEllipsis} />,
        "play":      <FontAwesomeIcon icon={faPlay} />,
        "pause":     <FontAwesomeIcon icon={faPause} />,
        "stop":      <FontAwesomeIcon icon={faStop} />
    }

    const labelMap: { [key in IconProps["type"]]: string } = {
        "stopwatch": "Stopwatch",
        "puzzle":    "Polls",
        "chat":      "Chat",
        "users":     "Students",
        "ellipsis":  "More",
        "play":      "Start",
        "pause":     "Pause",
        "stop":      "Stop"
    }

    const iconComponent = iconMap[type];
    const label = labelMap[type];

    return (
        <button className={styles.container}>
            {iconComponent}
            {showLabel != false ? <div className={styles.label}>{label}</div> : null}
        </button>
    )
}