'use client'
import styles from './LabeledIconBtn.module.css';
import LabeledIcon from '../../LabeledIcon/LabeledIcon';
import { ColorType } from '@/utils/Colors';
import { IconName, IconSize } from '@/utils/Icons';


interface LabeledIconBtnProps {
    type: IconName;
    label?: string;
    iconColor?: ColorType;
    labelColor?: ColorType;
    size?: IconSize;
    onClick?: () => void;
}

export default function LabeledIconBtn({ type, iconColor, labelColor, label, size, onClick }: LabeledIconBtnProps) {
    return (
        <button className={styles.btn} onClick={onClick}>
            <LabeledIcon type={type} label={label} iconColor={iconColor} labelColor={labelColor} size={size} />
        </button>
    )
}