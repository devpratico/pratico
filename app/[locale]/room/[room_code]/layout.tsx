import { fetchRoomByCode, Room, getUserId } from "./_actions/actions";
import { TLEditorProvider } from '@/app/[locale]/_hooks/useTLEditor';
import { NavProvider } from '@/app/[locale]/_hooks/useNav';
import { RoomProvider } from '@/app/[locale]/_hooks/useRoom';
import { PresencesProvider } from "../../_hooks/usePresences";
import { MenuProvider } from "../../_hooks/useMenu";


interface LayoutProps {
    studentView: React.ReactNode;
    teacherView: React.ReactNode;
    params: { room_code: string };
}

export const revalidate = 0

export default async function Layout({studentView, teacherView, params}: LayoutProps) {
    const { room_code } = params;

    // Fetch room data
    let room: Room
    try {
        room = await fetchRoomByCode(room_code)
    } catch (error) {
        return <div>{"Room " + room_code + " not found. " + (error as Error).message}</div>
    }

    // Check if user is teacher or student, and render the appropriate view
    const user_id = await getUserId()

    let page: React.ReactNode

    if (room.created_by === user_id) {
        page = teacherView
    } else {
        page = studentView
    }

    return (
        <TLEditorProvider>
            <RoomProvider initialRoom={room}>
                <NavProvider>
                    <MenuProvider>
                        <PresencesProvider>
                            {page}
                        </PresencesProvider>
                    </MenuProvider>
                </NavProvider>
            </RoomProvider>
        </TLEditorProvider>
    )
}