'use client'
import { Button, Flex, Text } from "@radix-ui/themes"
import { useMenu, DeskMenu } from "../../../../_hooks/useMenu";


interface MenuBtnProps {
    children: React.ReactNode
    message: string
    menu: DeskMenu
}


export default function MenuBtn({children, message, menu}: MenuBtnProps) {
    const { setOpenDeskMenu } = useMenu()

    return (
        <Button
            variant='ghost'
            style={{ color: 'var(--background)' }}
            onClick={() => setOpenDeskMenu(menu)}
        >
            <Flex direction='column' align='center' gap='1'>
                {children}
                <Text as='label' size='1'>{message}</Text>
            </Flex>
        </Button>
    )
}