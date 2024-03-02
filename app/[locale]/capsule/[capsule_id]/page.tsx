import styles from './page.module.css'
import MainLayout from '../../../../components/layouts/MainLayout/MainLayout'
import Desk from '@/components/desk/Desk/Desk'
import { Capsule, getCapsule } from '@/supabase/services/capsules';
import { SupabaseError } from '@/supabase/types/errors';
import { CapsuleProvider } from '@/hooks/capsuleContext';
import { RoomProvider } from '@/hooks/roomContext';
import { Room, getRoomsByCapsuleId } from '@/supabase/services/rooms';


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

    return (
        <main className={styles.main}>
            <CapsuleProvider value={{ capsule }}>
                <RoomProvider value={{ room: rooms[0] }}>
                    <MainLayout content={<Desk/>} />
                </RoomProvider>
            </CapsuleProvider>
        </main>
    )
}