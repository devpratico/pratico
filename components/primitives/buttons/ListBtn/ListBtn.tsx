'use client'
import styles from './ListBtn.module.css';
import Link from 'next/link';
import { getIcon, IconName } from '@/utils/old_Icons';

interface ListBtnProps {
    title: string;
    href: string;
    active?: boolean;
    iconName?: IconName;
}

export default function ListBtn({ title, href, active, iconName }: ListBtnProps) {

    let icon = null;
    if (iconName) {
        icon = getIcon(iconName);
    }

    let containerClass = styles.container;
    if (active) {
        containerClass += " " + styles.active;
    }

    return (
        <Link href={href} className={containerClass}>
            <span className={styles.icon}>{icon}</span>
            <p className={styles.title}>{title}</p>
        </Link>
    )
}