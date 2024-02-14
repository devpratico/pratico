'use client'
import styles from './ListBtn.module.css';
import Link from 'next/link';


interface ListBtnProps {
    title: string;
    href: string;
    active?: boolean;
}

export default function ListBtn({ title, href, active}: ListBtnProps) {

    let containerClass = styles.container;
    if (active) {
        containerClass += " " + styles.active;
    }

    return (
        <Link href={href} className={containerClass}>
            <p className={styles.title}>{title}</p>
        </Link>
    )
}