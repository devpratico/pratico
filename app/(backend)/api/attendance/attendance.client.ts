'use server';
import createClient from "@/supabase/clients/server";
import logger from "@/app/_utils/logger";
import { TablesInsert } from "@/supabase/types/database.types";
import { fetchProfile, fetchUser } from "../user/user.server";
import { fetchOpenRoomByCode, fetchRoomCreator, roomCreatorIsPaidCustomer } from "../room/room.server";
import { countAttendances } from "./attendance.server";
import { sendDiscordMessage } from "../discord/discord.server";


export type AttendanceInsert = TablesInsert<'attendance'>

export const createAttendance = async (firstName: string, lastName: string, roomCode: string | undefined) => {
    const { user, error: userError } = await fetchUser();
    if (!user || !roomCode || userError) {
        if (!userError) {
            logger.log('next:page', !user ? 'User not found' : 'or room info is missing');
            return ({ error: 'createAttendance: User not found or roonmCode missing' })
        }

        return ({ error: userError });
    }
    const { data: roomData } = await fetchOpenRoomByCode(roomCode);

    const attendance: AttendanceInsert = {
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        signature: true,
        room_id: roomData?.id,
    };
    logger.log('supabase:database', 'createAttendance:', attendance);

    const supabase = createClient();
    const { error } = await supabase.from('attendance').insert(attendance);
    if (error) logger.error('supabase:database', 'Error creating attendance', error.message)
    return ({ error: error?.message });
};

export const checkLimitAttendance = async (roomCode: string | undefined) => {
	const { user, error: userError } = await fetchUser();
    if (!user || !roomCode || userError) {
        if (!userError) {
            logger.log('next:page', !user ? 'User not found' : 'or room info is missing');
            return ({ error: 'checkLimitAttendance: User not found or roomCode missing' })
        }

        return ({ error: userError });
    }
    const { data: roomData } = await fetchOpenRoomByCode(roomCode);
	if (!roomData) {
		logger.error('next:page', 'Room not found');
		return ({ error: 'Room not found' });
	}
	const isPaidCustomer = await roomCreatorIsPaidCustomer(roomData.id);
	if (!isPaidCustomer)
	{
		const maxParticipants = 1;
		const attendanceCount = await countAttendances(roomData.id);
		if (attendanceCount >= maxParticipants) {
			logger.log('next:page', 'StudentViewPage', 'attendance count is greater than 10. Blocking user.');
			const { data: creatorData, error: creatorError } = await fetchRoomCreator(roomData!.code!);
				const creatorId = creatorData?.created_by;
				if (creatorId) {
					const { data } = await fetchProfile(creatorId);
					let creatorName = (data?.first_name || '')  + ' ' + (data?.last_name || '');
					if (creatorName === ' ') creatorName = 'un utilisateur anonyme';
					await sendDiscordMessage(`🚪 **Limite de Pratico Free** atteinte (${maxParticipants} participants) pour ${creatorName} dans la salle ${roomCode} !`);
				}
			return ({ error: 'Le nombre maximum de participants est atteint (10). Veuillez contacter l\'organisateur pour obtenir un accès.' });
		}
	}
	return ({ error: null });
};