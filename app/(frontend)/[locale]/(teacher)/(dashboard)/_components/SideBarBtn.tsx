'use client'
import { Flex, Text, Box } from "@radix-ui/themes"
import { Link } from "@/app/(frontend)/_intl/intlNavigation"
import { usePathname } from "@/app/(frontend)/_intl/intlNavigation";


interface SideBarBtnProps {
    href: string;
    message: string;
    children: React.ReactNode;
}


export function SideBarBtn({ href, message, children }: SideBarBtnProps) {
    const pathName = usePathname();
    const active = pathName === href;

    const style = {
        flexGrow: 1,
        textDecoration: 'none',
        padding: 'var(--space-2)',
        color: 'var(--accent-10)',
        borderRadius: 'var(--radius-3)',
        cursor: 'pointer',
        ...(active ? { backgroundColor: 'var(--accent-3)' } : {})
    }

    return (
        <Box style={style} asChild>
            <Link href={href}>
                <Flex align='center' gap='2'>
                    {children}
                    <Text size='3' truncate>{message}</Text>
                </Flex>
            </Link>
        </Box>
    )
}