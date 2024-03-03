import styles from './page.module.css'
import MainLayout from '../../../../components/layouts/MainLayout/MainLayout'
import Desk from '@/components/desk/Desk/Desk'
import { Capsule, getCapsule } from '@/supabase/services/capsules';
import { SupabaseError } from '@/supabase/types/errors';
import { CapsuleProvider } from '@/hooks/capsuleContext';
import { RoomProvider } from '@/hooks/roomContext';
import { Room, getRoomsByCapsuleId } from '@/supabase/services/rooms';
import TLMenubar from '@/components/desk/custom-ui/TLMenubar/TLMenubar';
import Resizer from '@/components/desk/custom-ui/Resizer/Resizer';
import EmbedHint from '@/components/desk/custom-ui/EmbedHint/EmbedHint';
import TLToolbar from '@/components/desk/custom-ui/TLToolbar/TLToolbar';
import TLSlidebar from '@/components/desk/custom-ui/TLSlidebar/TLSlidebar';


export const dynamic = 'force-dynamic'

export default async function CapsulePage({params}: {params: { capsule_id: string }}) {
    const { capsule_id } = params;
    let capsule: Capsule
    let rooms: Room[] // TODO: handle the case where there are several rooms (or none)
    
    try { 
        capsule = await getCapsule(capsule_id)
        rooms   = await getRoomsByCapsuleId(capsule_id)
    } catch (error) { 
        return <div>{(error as SupabaseError).message}</div>
    }

    const deskComponent = (
        <Desk>
            <Resizer/>
            <EmbedHint/>
            <TLMenubar/>
            <TLToolbar/>
            <TLSlidebar/>
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