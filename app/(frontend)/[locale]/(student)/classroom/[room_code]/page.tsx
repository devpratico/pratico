import StudentCanvas from './_components/StudentCanvas'
import { fetchUser } from '@/app/(backend)/api/user/user.server'
import { redirect } from '@/app/(frontend)/_intl/intlNavigation'
import { CanvasUser } from '@/app/(frontend)/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchOpenRoomByCode } from '@/app/(backend)/api/room/room.server'
import logger from '@/app/_utils/logger'
import { fetchUserHasSignedAttendance } from '@/app/(backend)/api/attendance/attendance.server'
import { roomCreatorIsPaidCustomer, getRoomCreator } from '@/app/(backend)/data-access/room'
import { countAttendances } from '@/app/(backend)/data-access/attendance'
import { discordMessageSender } from '@/app/(backend)/api/discord/utils'
import { getProfile } from '@/app/(backend)/data-access/user'


export default async function StudentViewPage({ params }: { params: { room_code: string } }) {

    // Check user is logged in (can be anonymous)
    const { user, error: userError } = await fetchUser();
    if (!user || userError) {
        logger.log('next:page', 'User info missing or error fetchingUser, redirecting to form', userError ? userError : null);
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return (null);
    }
    
    // Check room exists
	const { data: roomData, error: roomError } = await fetchOpenRoomByCode(params.room_code);
    if (roomError || !roomData) {
		logger.log("next:page", "StudentViewPage", "room error", roomError);
		throw (roomError);
	}

    // Check user has signed attendance
	logger.log('supabase:database', 'page classroom fetchOpenRoom id:', roomData.id);
	const { data , error  } = await fetchUserHasSignedAttendance(roomData.id, user.id);
	logger.log('supabase:database', 'fetUserHasSignedAttendance', data);
	if (!data || !data?.first_name || !data?.last_name || error) {
        logger.log('next:page', 'Attendance one of the names or both not found, redirecting to form', error ? error : null);
        const nextUrl = `/classroom/${params.room_code}`;
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString());
        return (null);
    }

    // Check teacher is a paid customer
    const isPaidCustomer = await roomCreatorIsPaidCustomer(roomData.id);
    if (!isPaidCustomer) {
        // Only 10 participants are allowed for free customers.
        const maxParticipants = 10;
        const attendanceCount = await countAttendances(roomData.id);
        if (attendanceCount >= maxParticipants) {
            logger.log('next:page', 'StudentViewPage', 'attendance count is greater than 10. Blocking user.');

            const { data: creatorData, error: creatorError } = await getRoomCreator(roomData!.id);
            const creatorId = creatorData?.created_by;
            if (creatorId) {
                //const creatorName = (await getProfile(creatorId)
                const { data } = await getProfile(creatorId);
                let creatorName = (data?.first_name || '')  + ' ' + (data?.last_name || '');
                if (creatorName === ' ') creatorName = 'un utilisateur anonyme';
                await discordMessageSender(`🚪 **Limite de Pratico Free** atteinte (${maxParticipants} participants) pour ${creatorName} dans la salle ${params.room_code} !`);
            }

            throw new Error('Le nombre maximum de participants est atteint (10). Veuillez contacter l\'organisateur pour obtenir un accès.');
        }
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