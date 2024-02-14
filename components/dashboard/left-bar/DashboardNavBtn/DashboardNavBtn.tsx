'use client'
import { usePathname } from 'next/navigation';
import ListBtn from '@/components/primitives/buttons/ListBtn/ListBtn';


interface DashboardNavBtnProps {
    title: string;
    href: string;
}

/**
 * This is just a ListBtn that knows when it's active
 */
export default function DashboardNavBtn({ title, href }: DashboardNavBtnProps) {
    let pathname = usePathname();
    pathname = pathname.replace(/\/[a-z]{2}/, ''); // Remove locale from pathname
    const active = pathname === href;
    return (
        <ListBtn title={title} href={href} active={active}/>
    )
}