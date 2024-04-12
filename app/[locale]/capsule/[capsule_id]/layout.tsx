import { Room } from "@/supabase/services/rooms";
import { fetchRoomsByCapsuleId } from "@/supabase/services/rooms";
import { SupabaseError } from "@/supabase/types/errors";
import { TLEditorProvider } from '@/app/[locale]/_hooks/useTLEditor';
import { NavProvider } from '@/app/[locale]/_hooks/useNav';
import { RoomProvider } from '@/app/[locale]/_hooks/useRoom';
import logger from "@/app/_utils/logger";



interface LayoutProps {
    children: React.ReactNode;
    params: { capsule_id: string };
}


export default async function Layout({ children, params: { capsule_id } }: LayoutProps) {

    // TODO: handle the case where there are several rooms (or none)
    let rooms: Room[] | undefined = undefined
    
    try {
        rooms = await fetchRoomsByCapsuleId(capsule_id)
    } catch (error) {
        logger.log('react:layout', 'No rooms fetched', (error as SupabaseError).message)
    }


    // TODO: Remove RoomProvider and use the url to determine the room code
    // Or redirect to the room page instead of staying on the capsule page
    return (
        <TLEditorProvider>
            <RoomProvider initialRoom={rooms?.[0]}>
                <NavProvider>
                    { children }
                </NavProvider>
            </RoomProvider>
        </TLEditorProvider>
    )
}