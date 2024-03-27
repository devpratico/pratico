import { Capsule } from "@/supabase/services/capsules";
import { Room } from "@/supabase/services/rooms";
import { fetchCapsule } from "@/supabase/services/capsules";
import { fetchRoomsByCapsuleId } from "@/supabase/services/rooms";
import { SupabaseError } from "@/supabase/types/errors";
import { TLEditorProvider } from '@/hooks/useTLEditor';
import { NavProvider } from '@/hooks/useNav';
import { CapsuleProvider } from '@/hooks/old_useCapsule';
import { RoomProvider } from '@/hooks/useRoom';



interface LayoutProps {
    children: React.ReactNode;
    params: { capsule_id: string };
}


export default async function Layout({ children, params: { capsule_id } }: LayoutProps) {

    //let capsule: Capsule
    let rooms: Room[] // TODO: handle the case where there are several rooms (or none)
    
    try {
        //capsule = await fetchCapsule(capsule_id)
        rooms   = await fetchRoomsByCapsuleId(capsule_id)
    } catch (error) {
        // TODO: figure out how errors work with Next.js
        return <div>{(error as SupabaseError).message}</div>
    }

    return (
        <TLEditorProvider>
            {/*<CapsuleProvider value={{ capsule }}>*/}
                <RoomProvider initialRoom={rooms[0]}>
                    <NavProvider>
                        { children }
                    </NavProvider>
                </RoomProvider>
            {/*</CapsuleProvider>*/}
        </TLEditorProvider>
    )
}