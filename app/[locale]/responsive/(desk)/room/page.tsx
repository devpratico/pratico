import MenuTabs from "../_components/MenuTabs"
import { Flex } from "@radix-ui/themes"
import TopBarPortal from "../_components/TopBarPortal"
import { Puzzle, MessageSquareText, Users, Ellipsis } from 'lucide-react';


export default function Page() {
    return (
        <>
            <TopBarPortal>
                <Flex justify='between' align='center'>
                    <p>RoomTopBar</p>
                    <MenuTabs tabs={[
                        { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                        { menu: 'participants', label: 'Participants', icon: <Users /> },
                        { menu: 'chat', label: 'Chat', icon: <MessageSquareText /> },
                        { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                    ]} />
                </Flex>
            </TopBarPortal>

            <p>Desk Room (animation)</p>
        </>
    )
}