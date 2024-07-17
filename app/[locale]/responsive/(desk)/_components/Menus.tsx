'use client'
import { useSearchParams } from "next/navigation"
import { Box } from "@radix-ui/themes"

/**
 * Displays the correct menu based on the 'menu' query parameter.
 */
export default function Menus() {
    const searchParams = useSearchParams()
    const menu = searchParams.get('menu')

    return (
        <>
            <Box display={menu == 'activities' ? 'block' : 'none'}>Activités</Box>
            <Box display={menu == 'participants' ? 'block' : 'none'}>Participants</Box>
            <Box display={menu == 'chat' ? 'block' : 'none'}>Chat</Box>
            <Box display={menu == 'more' ? 'block' : 'none'}>Plus</Box>
        </>
    )
}