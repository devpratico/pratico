'use client'
import styles from './LabeledIconBtn.module.css';
import LabeledIcon from '../../LabeledIcon/LabeledIcon';
import { LabeledIconProps } from '../../LabeledIcon/LabeledIcon';


interface LabeledIconBtnProps extends LabeledIconProps {
    onClick?: () => void;
    disabled?: boolean;
}

export default function LabeledIconBtn({ onClick, disabled, ...labeledIconProps }: LabeledIconBtnProps) {
    return (
        <button className={styles.btn + " " + labeledIconProps.className} onClick={onClick} disabled={disabled}>
            <LabeledIcon {...labeledIconProps} />
        </button>
    )
}