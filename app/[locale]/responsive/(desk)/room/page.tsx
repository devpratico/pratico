import MenuTabs from "../_components/MenuTabs"
import { Flex, Box, IconButton } from "@radix-ui/themes"
import TopBarPortal from "../_components/TopBarPortal"
import { Puzzle, MessageSquareText, Users, Ellipsis, QrCode } from 'lucide-react';
import CardDialog from "../_components/CardDialog";


export default function Page() {
    return (
        <>
            <TopBarPortal>
                <Flex justify={{initial:'center', xs:'between'}} align='center'>
                    
                    <Flex align='center' gap='4' display={{ initial: 'none', xs: 'flex' }}>
                        <Box >Logo</Box>

                        <CardDialog trigger={<IconButton><QrCode /></IconButton>}>
                            <p>Hello</p>
                        </CardDialog>

                        
                    </Flex>

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