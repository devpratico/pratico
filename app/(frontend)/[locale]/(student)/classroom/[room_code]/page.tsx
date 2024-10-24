import StudentCanvas from './_components/StudentCanvas'
import { fetchUser } from '@/app/(backend)/api/user/user.server'
import { redirect } from '@/app/(frontend)/_intl/intlNavigation'
import { CanvasUser } from '@/app/(frontend)/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchOpenRoomByCode } from '@/app/(backend)/api/room/room.server'
import logger from '@/app/_utils/logger'
import { fetchUserHasSignedAttendance } from '@/app/(backend)/api/attendance/attendance.server'

export default async function StudentViewPage({ params }: { params: { room_code: string } }) {
    const { user, error: userError } = await fetchUser();
    if (!user || userError) {
        logger.log('next:page', 'User info missing or error fetchingUser, redirecting to form', userError ? userError : null);
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return (null);
    }
	const { data: roomData, error: roomError } = await fetchOpenRoomByCode(params.room_code);
    if (roomError) {
		logger.log("next:page", "StudentViewPage", "room error", roomError);
		throw (roomError);
	}

	logger.log('supabase:database', 'page classroom fetchOpenRoom id:', roomData?.id);
	const { data , error  } = await fetchUserHasSignedAttendance(roomData?.id, user.id);
	logger.log('supabase:database', 'fetUserHasSignedAttendance', data);

	if (!data || !data?.first_name || !data?.last_name || error) {
        logger.log('next:page', 'Attendance one of the names or both not found, redirecting to form', error ? error : null);
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