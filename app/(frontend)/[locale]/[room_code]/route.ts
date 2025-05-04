import { redirect } from "@/app/(frontend)/_intl/intlNavigation";
import { fetchRoomCreator } from "@/app/(backend)/api/room/room.server";
import { fetchUser } from "@/app/(backend)/api/user/user.server";
import logger from "@/app/_utils/logger";

/**
 * This route compares the user id with the room creator id
 * and redirects the user to the appropriate page
 */
export async function GET(request: Request, { params }: { params: Promise<{ room_code: string }> }) {
    const { room_code } = await params
    const { data, error: roomCreatorErr } = await fetchRoomCreator(room_code)

    if (roomCreatorErr || !data) {
        logger.error('supabase:auth', '[room_code]/route.ts', 'error fetching room creator', roomCreatorErr)
    }

    const roomCreatorId = data?.created_by
    const {user, error} = await fetchUser()

    if (error || !user) {
        logger.error('supabase:auth', '[room_code]/route.ts', 'error fetching user', error)
    }

    const isTeacher = roomCreatorId === user?.id

    if (isTeacher) {
        redirect(`/room/${room_code}`)
    } else {
        redirect(`/classroom/${room_code}`)
    }
}