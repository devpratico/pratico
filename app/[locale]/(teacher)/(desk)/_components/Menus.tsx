'use client'
import { useSearchParams } from "next/navigation"
import { Box } from "@radix-ui/themes"


interface MenusProps {
    ActivitiesMenu: React.ReactNode
    ParticipantsMenu: React.ReactNode
    DefilementMenu: React.ReactNode
    ChatMenu: React.ReactNode
    MoreMenu: React.ReactNode
}

/**
 * Displays the correct menu based on the 'menu' query parameter.
 */
export default function Menus({ ActivitiesMenu, ParticipantsMenu, DefilementMenu, ChatMenu, MoreMenu }: MenusProps) {
    const searchParams = useSearchParams()
    const menu = searchParams.get('menu')

    return (
        <>
            <Box display={menu == 'activities' ? 'block' : 'none'}>
                {ActivitiesMenu}
            </Box>

            <Box display={menu == 'participants' ? 'block' : 'none'}>
                {ParticipantsMenu}
            </Box>

            <Box display={menu == 'defilement' ? 'block' : 'none'}>
                {DefilementMenu}
            </Box>

            <Box display={menu == 'chat' ? 'block' : 'none'}>
                {ChatMenu}
            </Box>

            <Box display={menu == 'more' ? 'block' : 'none'}>
                {MoreMenu}
            </Box>

        </>
    )
}