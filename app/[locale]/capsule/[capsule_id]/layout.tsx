import { fetchRoomsByCapsuleId } from "./actions";
import { TLEditorProvider } from '@/app/[locale]/_hooks/useTLEditor';
import { NavProvider } from '@/app/[locale]/_hooks/useNav';
import logger from "@/app/_utils/logger";
import { MenusProvider } from "../../_hooks/useMenus";
import { redirect } from "@/app/_intl/intlNavigation";


export const revalidate = 0;

interface LayoutProps {
    children: React.ReactNode;
    params: { capsule_id: string };
}

export default async function Layout({ children, params: { capsule_id } }: LayoutProps) {
    // If there are some rooms for this capsule, redirect to the room page
    const rooms = await fetchRoomsByCapsuleId(capsule_id)
    if (rooms.length > 0) {
        const roomCode = rooms[0].code
        logger.log('react:layout', 'Room detected. Redirecting to room', roomCode)
        redirect(`/room/${roomCode}`)
        return null
    } else {
        logger.log('react:layout', 'No room detected. Opening capsule creation page')
    }

    return (
        <TLEditorProvider>
            <NavProvider>
                <MenusProvider>
                    { children }
                </MenusProvider>
            </NavProvider>
        </TLEditorProvider>
    )
}