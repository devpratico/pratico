import styles from './page.module.css'
import MainLayout from '../../../../components/layouts/MainLayout/MainLayout'
import Desk from '@/components/desk/Desk/Desk'
import { Capsule, fetchCapsule } from '@/supabase/services/capsules';
import { SupabaseError } from '@/supabase/types/errors';
import { CapsuleProvider } from '@/hooks/capsuleContext';
import { RoomProvider } from '@/hooks/roomContext';
import { Room, fetchRoomsByCapsuleId } from '@/supabase/services/rooms';
import TLMenubar from '@/components/desk/custom-ui/TLMenubar/TLMenubar';
import Resizer from '@/components/desk/custom-ui/Resizer/Resizer';
import EmbedHint from '@/components/desk/custom-ui/EmbedHint/EmbedHint';
import TLToolbar from '@/components/desk/custom-ui/TLToolbar/TLToolbar';
import TLSlidebar from '@/components/desk/custom-ui/TLSlidebar/TLSlidebar';
import DeskMenus from '@/components/menus/DeskMenus/DeskMenus';


export const revalidate = 0

export default async function CapsulePage({params}: {params: { capsule_id: string }}) {
    const { capsule_id } = params;
    let capsule: Capsule
    let rooms: Room[] // TODO: handle the case where there are several rooms (or none)
    
    try {
        capsule = await fetchCapsule(capsule_id)
        rooms   = await fetchRoomsByCapsuleId(capsule_id)
    } catch (error) { 
        return <div>{(error as SupabaseError).message}</div>
    }

    /* We pass custom ui components here because here is the closest parent server component,
    *  and as they are themselves server components (because of traduction), they can't be
    *  imported into client components.
    */
    const deskComponent = (
        <Desk>
            <Resizer/>
            <EmbedHint/>
            <TLMenubar/>
            <TLToolbar/>
            <TLSlidebar/>
            <DeskMenus/>
        </Desk>
    )

    return (
        <main className={styles.main}>
            <CapsuleProvider value={{ capsule }}>
                <RoomProvider initialRoom={rooms[0]}>
                    <MainLayout content={deskComponent}/>
                </RoomProvider>
            </CapsuleProvider>
        </main>
    )
}