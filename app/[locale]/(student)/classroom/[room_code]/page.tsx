import StudentCanvas from './_components/StudentCanvas'
import { fetchUser, fetchNames } from '@/app/api/_actions/user'
import { redirect } from '@/app/_intl/intlNavigation'
import { CanvasUser } from '@/app/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchOpenRoomByCode } from '@/app/api/_actions/room'
import logger from '@/app/_utils/logger'
import { fetchNamesFromAttendance } from '@/app/api/_actions/attendance'


export default async function StudentViewPage({ params }: { params: { room_code: string } }) {
    const { user, error: userError } = await fetchUser();
    if (!user || userError) {
        logger.log('next:page', 'User info missing or error fetchingUser, redirecting to form', userError ? userError : null);
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return (null);
    }
	const { data: roomData, error: roomError } = await fetchOpenRoomByCode(params.room_code);
    if (roomError) throw roomError;
	logger.log('supabase:database', 'page classroom fetchOpenRoom id:', roomData?.id);
	const { data , error  } = await fetchNamesFromAttendance(user.id);

	if (!data?.first_name || !data?.last_name || error) {
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
    )
}