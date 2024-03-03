import styles from "./page.module.css";
import { RoomProvider } from "@/hooks/roomContext";
import { Room, fetchRoomByName } from "@/supabase/services/rooms";
import logger from "@/utils/logger";
import CanvasST from "@/components/desk/CanvasST/CanvasST";
import Resizer from "@/components/desk/custom-ui/Resizer/Resizer";
import TLToolbar from "@/components/desk/custom-ui/TLToolbar/TLToolbar";




export default async function RoomPage({params}: {params: { room_name: string }}) {
    const { room_name } = params;

    let room: Room
    try {
        room = await fetchRoomByName(room_name)
    } catch (error) {
        logger.error('supabase:database', 'error getting room by name', (error as Error).message)
        return <div>{(error as Error).message}</div>
    }

    return (
        <div className={styles.container}>
            <RoomProvider initialRoom={room}>
                <CanvasST roomName={room_name}>
                    <Resizer />
                    <TLToolbar />
                </CanvasST>
            </RoomProvider>
        </div>
    )
}