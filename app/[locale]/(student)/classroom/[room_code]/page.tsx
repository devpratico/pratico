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
        logger.log('next:page', 'User info missing, redirecting to form');
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return (null);
    }
    const { first_name, last_name } = await fetchNamesFromAttendance(user.id);
	if (((!first_name || !last_name) && user)) {
        logger.log('next:page', 'Attendance info missing, redirecting to form', first_name, last_name);
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return (null);
    }
	logger.log('next:page', 'Attendance info:', first_name, last_name);

    const canvasUser: CanvasUser = {
        id: user.id,
        name: `${first_name} ${last_name}`,
        color: getRandomColor(),
    }

    //const room = await fetchRoomByCode(params.room_code)
    //const snapshot = room?.capsule_snapshot || undefined

    const { data, error: roomError } = await fetchOpenRoomByCode(params.room_code)
    if (roomError) throw roomError
    const snapshot = data?.capsule_snapshot || undefined as any

    return (
        <StudentCanvas user={canvasUser} snapshot={snapshot} />
    )
}