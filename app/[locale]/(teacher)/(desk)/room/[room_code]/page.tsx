import MenuTabs from "../../_components/MenuTabs"
import { Flex, Box, IconButton } from "@radix-ui/themes"
import TopBarPortal from "../../_components/TopBarPortal"
import { Puzzle, MessageSquareText, Users, Ellipsis, QrCode } from 'lucide-react';
import CardDialog from "../../_components/CardDialog";
import TeacherCanvas from "./_components/TeacherCanvasServer";
import { RoomProvider } from "@/app/_hooks/useRoom";



export default function Page({ params: { room_code } }: { params: { room_code: string } }) {
    return (
        <RoomProvider>
            <TopBarPortal>
                <Flex justify={{initial:'center', xs:'between'}} align='center'>
                        
                    <Flex align='center' gap='4' display={{ initial: 'none', xs: 'flex' }}>
                        <Box >Logo</Box>

                        <p>{room_code}</p>

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

            <TeacherCanvas roomCode={room_code} />

        </RoomProvider>
    )
}