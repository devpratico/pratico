import styles from "./page.module.css";
import { RoomProvider } from "@/hooks/roomContext";
import { Room, fetchRoomByCode } from "@/supabase/services/rooms";
import logger from "@/utils/logger";
import CanvasST from "@/components/desk/CanvasST/CanvasST";
import Resizer from "@/components/desk/custom-ui/Resizer/Resizer";
import TLToolbar from "@/components/desk/custom-ui/TLToolbar/TLToolbar";
import DeskLayout from "@/components/layouts/DeskLayout/DeskLayout";


// TODO: use intercepting routes or something to handle if the connected user is the owner of the room

export default async function RoomPage({params}: {params: { room_code: string }}) {
    const { room_code } = params;

    let room: Room
    try {
        room = await fetchRoomByCode(room_code)
    } catch (error) {
        logger.error('supabase:database', 'error getting room by name', (error as Error).message)
        return <div>{(error as Error).message}</div>
    }

    return (
        <div className={styles.container}>
            <RoomProvider initialRoom={room}>
                <CanvasST>
                    <DeskLayout toolBar={<TLToolbar />}/>
                    <Resizer />
                </CanvasST>
            </RoomProvider>
        </div>
    )
}