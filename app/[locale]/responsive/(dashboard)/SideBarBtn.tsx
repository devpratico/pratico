'use client'
import { Flex } from "@radix-ui/themes"
import { Link } from "@/app/_intl/intlNavigation"
import { usePathname } from "@/app/_intl/intlNavigation";


interface SideBarBtnProps {
    href: string;
    active?: boolean;
    children: React.ReactNode;
}


export default function SideBarBtn({ href, children }: SideBarBtnProps) {
    const pathName = usePathname();
    const active = pathName === href;

    const style = {
        textDecoration: 'none',
        padding: 'var(--space-2)',
        color: 'var(--accent-10)',
        borderRadius: 'var(--radius-3)',
        cursor: 'pointer',
        ...(active ? { backgroundColor: 'var(--accent-3)' } : {})
    
    }

    return (
        <Link href={href} style={style}>
            <Flex align='center' gap='2'>
               {children}
            </Flex>
        </Link>
    )
}