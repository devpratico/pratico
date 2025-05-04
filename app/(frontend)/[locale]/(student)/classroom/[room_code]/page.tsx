import StudentCanvas from './_components/StudentCanvas'
import { fetchUser } from '@/app/(backend)/api/user/user.server'
import { redirect } from '@/app/(frontend)/_intl/intlNavigation'
import { CanvasUser } from '@/app/(frontend)/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchRoomByCode } from '@/app/(backend)/api/room/room.server'
import logger from '@/app/_utils/logger'
import { fetchUserAttendanceData } from '@/app/(backend)/api/attendance/attendance.server'
import RedirectIfRoomClosed from './_components/RedirectIfRoomClosed'


export default async function StudentViewPage({ params }: { params: Promise<{ room_code: string }> }) {

    const { room_code } = await params;

	// Check room exists
	const { data: roomData, error: roomError } = await fetchRoomByCode(room_code);
	if (roomError || !roomData) 
    {
        logger.error("next:page", "StudentViewPage", "room error", roomError);
        throw new Error("La session n'existe pas");
    }

    // Check room closed in the last 24 hours
    if (roomData.status === 'closed' && roomData.end_of_session) {
        const isRecentlyClosed = isRoomClosedInTheLast24h(roomData.end_of_session);
        logger.log("next:page", "StudentViewPage", "Room closed in the last 24h ?", isRecentlyClosed);
        if (isRecentlyClosed)
            return (redirect(`/classroom/closed/${roomData.id}`));
        throw new Error("La session est fermée");
	}

    // Check user is logged in (can be anonymous)
	const { user, error } = await fetchUser();
	if (!user || error) {
		logger.log('next:page', 'StudentViewPage', 'Student not logged in. Redirecting to form page', error);
		const nextUrl = `/classroom/${room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return null;
	}

    // Check user attendance data (if none, it means the user has not signed attendance yet)
    const { data: attendanceData, error: attendanceError } = await fetchUserAttendanceData(roomData.id, user!.id);

    if (attendanceError) { // If none found or more than one found, supabase will return an error
        logger.log('next:page', 'StudentViewPage', 'Student has not signed attendance yet. Redirecting to form page', user!.id, attendanceError);
        const nextUrl = `/classroom/${room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return null;
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

const isRoomClosedInTheLast24h = (endOfSession: string) => {
    return (endOfSession && Date.now() - new Date(endOfSession).getTime() <= 24 * 60 * 60 * 1000);
};