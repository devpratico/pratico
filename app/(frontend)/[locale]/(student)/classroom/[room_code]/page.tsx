import StudentCanvas from './_components/StudentCanvas'
import { fetchUser } from '@/app/(backend)/api/user/user.server'
import { redirect } from '@/app/(frontend)/_intl/intlNavigation'
import { CanvasUser } from '@/app/(frontend)/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchOpenRoomByCode } from '@/app/(backend)/api/room/room.server'
import logger from '@/app/_utils/logger'
import { fetchUserAttendanceData } from '@/app/(backend)/api/attendance/attendance.server'
import RedirectIfRoomClosed from './_components/RedirectIfRoomClosed'


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

    // Check user attendance data (if none, it means the user has not signed attendance yet)
    const { data: attendanceData, error: attendanceError } = await fetchUserAttendanceData(roomData.id, user!.id);

    if (attendanceError) { // If none found or more than one found, supabase will return an error
        logger.error('next:page', 'StudentViewPage', 'Error fetching attendance data', attendanceError);
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
    }

    const canvasUser: CanvasUser = {
        id: user!.id,
        name: `${attendanceData!.first_name} ${attendanceData!.last_name}`,
        color: getRandomColor(),
    }
  
    const snapshot = roomData?.capsule_snapshot || undefined as any
	 
    return (
        <RedirectIfRoomClosed roomId={roomData.id.toString()}>
            <StudentCanvas user={canvasUser} snapshot={snapshot} />
        </RedirectIfRoomClosed>
	);
}
