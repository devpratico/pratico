import StudentCanvas from './_components/StudentCanvas'
import { fetchUser } from '@/app/(backend)/api/user/user.server'
import { redirect } from '@/app/(frontend)/_intl/intlNavigation'
import { CanvasUser } from '@/app/(frontend)/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchOpenRoomByCode } from '@/app/(backend)/api/room/room.server'
import logger from '@/app/_utils/logger'
import { fetchUserHasSignedAttendance, countAttendances } from '@/app/(backend)/api/attendance/attendance.server'
import { fetchRoomCreator, roomCreatorIsPaidCustomer } from '@/app/(backend)/api/room/room.server'
import { fetchProfile } from '@/app/(backend)/api/user/user.server'
import { sendDiscordMessage } from '@/app/(backend)/api/discord/discord.server'
import { signInAnonymously } from '@/app/(backend)/api/auth/auth.client'

const MAX_PARTICIPANTS = 1;
export default async function StudentViewPage({ params }: { params: { room_code: string } }) {

	// Check room exists
	const { data: roomData, error: roomError } = await fetchOpenRoomByCode(params.room_code);
	if (roomError || !roomData) {
		logger.log("next:page", "StudentViewPage", "room error", roomError);
		throw (roomError || "Room not found");
	}

    // Check user is logged in (can be anonymous)
	const { user } = await fetchUser();
	if (!user) {
		logger.error('next:page', 'User not found');
		const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return (null);
	}

    // Check user has signed attendance
	logger.log('supabase:database', 'page classroom fetchOpenRoom id:', roomData.id);
	const { data , error: hasSignedError  } = await fetchUserHasSignedAttendance(roomData.id, user.id);
	logger.log('supabase:database', 'fetUserHasSignedAttendance', data);
	if (!data || !data?.first_name || !data?.last_name || hasSignedError) {
        logger.log('next:page', 'Attendance one of the names or both not found, redirecting to form', hasSignedError ? hasSignedError : null);
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return (null);
    }

    const canvasUser: CanvasUser = {
        id: user.id,
        name: `${data?.first_name} ${data?.last_name}`,
        color: getRandomColor(),
    }
  
    const snapshot = roomData?.capsule_snapshot || undefined as any
	 
    return (
		<StudentCanvas user={canvasUser} snapshot={snapshot} />
	);
}
