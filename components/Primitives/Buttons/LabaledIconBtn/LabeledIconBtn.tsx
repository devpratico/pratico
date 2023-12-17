'use client'
import styles from './LabeledIconBtn.module.css';
import LabeledIcon from '../../../LabeledIcon/LabeledIcon';
import { LabeledIconProps } from '../../../LabeledIcon/LabeledIcon';


interface LabeledIconBtnProps extends LabeledIconProps {
    onClick?: () => void;
}

export default function LabeledIconBtn({ onClick, ...labeledIconProps }: LabeledIconBtnProps) {
    return (
        <button className={styles.btn} onClick={onClick}>
            <LabeledIcon {...labeledIconProps} />
        </button>
    )
}