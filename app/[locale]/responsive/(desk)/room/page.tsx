import MenuTabs from "../_components/MenuTabs"
import { Flex, Box } from "@radix-ui/themes"
import TopBarPortal from "../_components/TopBarPortal"
import { Puzzle, MessageSquareText, Users, Ellipsis } from 'lucide-react';


export default function Page() {
    return (
        <>
            <TopBarPortal>
                <Flex justify={{initial:'center', xs:'between'}} align='center'>
                    
                    <Box display={{initial:'none', xs:'block'}}>Logo</Box>

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