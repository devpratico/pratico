import { Room } from "@/supabase/services/rooms";
import { fetchRoomsByCapsuleId } from "./_actions/capsuleActions";
import { SupabaseError } from "@/supabase/types/errors";
import { TLEditorProvider } from '@/app/[locale]/_hooks/useTLEditor';
import { NavProvider } from '@/app/[locale]/_hooks/useNav';
import { RoomProvider } from '@/app/[locale]/_hooks/useRoom';
import logger from "@/app/_utils/logger";
import { MenuProvider } from "./_hooks/useMenu";
import { PresencesProvider } from "../../_hooks/usePresences";



interface LayoutProps {
    children: React.ReactNode;
    params: { capsule_id: string };
}


export default async function Layout({ children, params: { capsule_id } }: LayoutProps) {

    // TODO: handle the case where there are several rooms (or none)
    let room: Room | undefined = undefined
    
    try {
        room = (await fetchRoomsByCapsuleId(capsule_id))?.[0]
    } catch (error) {
        logger.log('react:layout', 'No rooms fetched', (error as SupabaseError).message)
    }


    // TODO: Remove RoomProvider and use the url to determine the room code
    // Or redirect to the room page instead of staying on the capsule page
    return (
        <TLEditorProvider>
            <RoomProvider initialRoom={room}>
                <PresencesProvider roomId={room?.id.toString() || 'unknown'}>
                    <NavProvider>
                        <MenuProvider>
                            { children }
                        </MenuProvider>
                    </NavProvider>
                </PresencesProvider>
            </RoomProvider>
        </TLEditorProvider>
    )
}