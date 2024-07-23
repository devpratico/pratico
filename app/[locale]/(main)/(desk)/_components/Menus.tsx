'use client'
import { useSearchParams } from "next/navigation"
import { Box } from "@radix-ui/themes"
import ActivitiesMenu from "./menus/ActivitiesMenu"
import MoreMenu from "./menus/MoreMenu"
import ParticipantMenu from "./menus/ParticipantsMenu"
import ChatMenu from "./menus/ChatMenu"

/**
 * Displays the correct menu based on the 'menu' query parameter.
 */
export default function Menus() {
    const searchParams = useSearchParams()
    const menu = searchParams.get('menu')

    return (
        <>
            <Box display={menu == 'activities' ? 'block' : 'none'}>
                <ActivitiesMenu />
            </Box>

            <Box display={menu == 'participants' ? 'block' : 'none'}>
                <ParticipantMenu />
            </Box>

            <Box display={menu == 'chat' ? 'block' : 'none'}>
                <ChatMenu />
            </Box>

            <Box display={menu == 'more' ? 'block' : 'none'}>
                <MoreMenu />
            </Box>

        </>
    )
}