import { Room } from "@/supabase/services/rooms";
import { fetchRoomByCode } from "@/supabase/services/rooms";
import { SupabaseError } from "@/supabase/types/errors";
import { TLEditorProvider } from '@/hooks/useTLEditor';
import { NavProvider } from '@/hooks/useNav';
import { RoomProvider } from '@/hooks/useRoom';
import logger from "@/utils/logger";


interface LayoutProps {
    children: React.ReactNode;
    params: { room_code: string };
}

const revalidate = 0

export default async function Layout({children, params}: LayoutProps) {
    const { room_code } = params;

    let room: Room
    try {
        room = await fetchRoomByCode(room_code)
        logger.log('react:layout', `fetched room by code ${room_code}`)
    } catch (error) {
        logger.error('supabase:database', `error getting room by code "${room_code}"`, (error as Error).message)
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