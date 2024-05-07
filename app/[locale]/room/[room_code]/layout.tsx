import { fetchRoomByCode, Room } from "./_actions/actions";
import { TLEditorProvider } from '@/app/[locale]/_hooks/useTLEditor';
import { NavProvider } from '@/app/[locale]/_hooks/useNav';
import { RoomProvider } from '@/app/[locale]/_hooks/useRoom';
import { PresencesProvider } from "../../_hooks/usePresences";
import { MenuProvider } from "../../_hooks/useMenu";
import { getUser, fetchNames } from "../../_actions/user";


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
    const user = await getUser()

    let page: React.ReactNode

    if (room.created_by === user.id) {
        page = teacherView
    } else {
        page = studentView
    }

    // Construct the user object for the presence provider
    const names = await fetchNames(user.id)
    const presenceUser = {
        id: user.id,
        color: 'blue',
        firstName: names.first_name || '',
        lastName:  names.last_name || '',
    }

    return (
        <TLEditorProvider>
            <RoomProvider initialRoom={room}>
                <NavProvider>
                    <MenuProvider>
                        <PresencesProvider user={presenceUser}>
                            {page}
                        </PresencesProvider>
                    </MenuProvider>
                </NavProvider>
            </RoomProvider>
        </TLEditorProvider>
    )
}