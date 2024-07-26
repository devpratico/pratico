'use client'
import { Button, Flex, Text } from "@radix-ui/themes"
import { useMenus, DeskMenu } from "@/app/_hooks/useMenus";


interface MenuBtnProps {
    children: React.ReactNode
    message: string
    menu: DeskMenu
}


export default function MenuBtn({children, message, menu}: MenuBtnProps) {
    const { toggleDeskMenu } = useMenus()

    return (
        <Button
            variant='ghost'
            style={{ color:'var(--background)' }}
            onPointerDown={() => toggleDeskMenu(menu) }
        >
            <Flex direction='column' align='center' gap='1'>
                {children}
                <Text as='label' size='1'>{message}</Text>
            </Flex>
        </Button>
    )
}