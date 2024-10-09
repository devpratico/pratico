'use client'
import { useSearchParams } from "next/navigation"
import { Box } from "@radix-ui/themes"


interface MenusProps {
    menus: {
        [key: string]: React.ReactNode
    }
}

/**
 * Displays the correct menu element based on the 'menu=' search param.
 * The key should match the value of the search param.
 */
export default function MenuSelector({ menus }: MenusProps) {
    const searchParams = useSearchParams()
    const menu = searchParams.get('menu')

    return (
        <>
            {Object.entries(menus).map(([key, Component]) => (
                <Box key={key} display={menu === key ? 'block' : 'none'}>
                    {Component}
                </Box>
            ))}
        </>
    )
}