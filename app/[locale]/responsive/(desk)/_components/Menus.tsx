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
            <Box display={menu == 'one' ? 'block' : 'none'}>Activités</Box>
            <Box display={menu == 'two' ? 'block' : 'none'}>Gâteaux</Box>
            <Box display={menu == 'three' ? 'block' : 'none'}>Vélo</Box>
        </>
    )
}