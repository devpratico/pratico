import StudentCanvas from './_components/StudentCanvas'
import { fetchUser } from '@/app/(backend)/api/user/user.server'
import { redirect } from '@/app/(frontend)/_intl/intlNavigation'
import { CanvasUser } from '@/app/(frontend)/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchOpenRoomByCode } from '@/app/(backend)/api/room/room.server'
import logger from '@/app/_utils/logger'
import { fetchUserHasSignedAttendance } from '@/app/(backend)/api/attendance/attendance.server'
import { fetchNamesFromAttendance } from '@/app/(backend)/api/attendance/attendance.server'


export default async function StudentViewPage({ params }: { params: { room_code: string } }) {

	// Check room exists
	const { data: roomData, error: roomError } = await fetchOpenRoomByCode(params.room_code);
	if (roomError || !roomData) {
		logger.error("next:page", "StudentViewPage", "room error", roomError);
        throw new Error("Room not found");
	}

    // Check user is logged in (can be anonymous)
	const { user, error } = await fetchUser();
	if (!user || error) {
		logger.log('next:page', 'StudentViewPage', 'User not found', error);
		const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
	}

    // Check user has signed attendance
	const hasSignedAttendance = await fetchUserHasSignedAttendance(roomData.id, user!.id);
	if (!hasSignedAttendance) {
        logger.log('next:page', 'User has not signed attendance, redirecting to form');
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
    }

    // Fetch user names
    const { data } = await fetchNamesFromAttendance(user!.id);

    logger.log("next:page", "StudentViewPage", "user data", data);
    const canvasUser: CanvasUser = {
        id: user!.id,
        name: `${data?.first_name} ${data?.last_name}`,
        color: getRandomColor(),
    }
  
    const snapshot = roomData?.capsule_snapshot || undefined as any
	 
    return (
		<StudentCanvas user={canvasUser} snapshot={snapshot} />
	);
}
