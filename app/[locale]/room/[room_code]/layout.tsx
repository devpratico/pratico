import { fetchRoomByCode, Room } from "./_actions/actions";
import { TLEditorProvider } from '@/app/[locale]/_hooks/useTLEditor';
import { NavProvider } from '@/app/[locale]/_hooks/useNav';
import { RoomProvider } from '@/app/[locale]/_hooks/useRoom';


interface LayoutProps {
    children: React.ReactNode;
    params: { room_code: string };
}

export const revalidate = 0

export default async function Layout({children, params}: LayoutProps) {
    const { room_code } = params;

    let room: Room
    try {
        room = await fetchRoomByCode(room_code)
    } catch (error) {
        return <div>{(error as Error).message}</div>
    }

    return (
        <TLEditorProvider>
            <RoomProvider initialRoom={room}>
                <NavProvider>
                    { children }
                </NavProvider>
            </RoomProvider>
        </TLEditorProvider>
    )
}