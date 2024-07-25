import { fetchRoomCreator } from "@/app/api/_actions/room3";
import { TLEditorProvider } from '@/app/_hooks/useTLEditor';
import { NavProvider } from '@/app/_hooks/useNav';
import { RoomProvider } from '@/app/_hooks/useRoom';
import { PresencesProvider } from "@/app/_hooks/usePresences";
import { MenusProvider } from "@/app/_hooks/useMenus";
import { fetchUser } from "@/app/api/_actions/user";


interface LayoutProps {
    studentView: React.ReactNode;
    teacherView: React.ReactNode;
    params: { room_code: string };
}


export default async function Layout({studentView, teacherView, params}: LayoutProps) {
    const { room_code } = params;

    // Check if user is teacher or student to render the appropriate view
    const roomCreatorId = await fetchRoomCreator(room_code)
    const user = await fetchUser()
    const isTeacher = roomCreatorId === user.id

    return (
        <TLEditorProvider>
            <RoomProvider>
                <NavProvider>
                    <MenusProvider>
                        <PresencesProvider roomCode={room_code} userId={user.id}>
                            {isTeacher ? teacherView : studentView}
                        </PresencesProvider>
                    </MenusProvider>
                </NavProvider>
            </RoomProvider>
        </TLEditorProvider>
    )
}