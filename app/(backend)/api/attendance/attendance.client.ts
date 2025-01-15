'use server';
import createClient from "@/supabase/clients/server";
import logger from "@/app/_utils/logger";
import { fetchOpenRoomByCode, roomCreatorIsPaidCustomer } from "../room/room.server";
import { countAttendances } from "./attendance.server";
import { sendDiscordMessage } from "../discord/discord.server";
import { TablesInsert } from "@/supabase/types/database.types";


export type AttendanceInsert = TablesInsert<'attendance'>

export const createAttendance = async (firstName: string, lastName: string, roomCode: string, userId: string, additionalInfo?: string) => {
    const supabase = createClient()
    const { data: roomData, error: roomError } = await supabase.from('rooms').select('id').eq('code', roomCode).eq('status', 'open').single()
    logger.log('supabase:database', 'roomData:', roomData);
    if (roomError) logger.error('supabase:database', `error getting room by code "${roomCode}"`, roomError.message)
    if (!additionalInfo)
        logger.log("next:api", "createAttendance", "No additional info provided");
    logger.log("next:api", "createAttendance", "Creating attendance for user", firstName, lastName, additionalInfo);
    const attendance: AttendanceInsert = {
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        signature: true,
        room_id: roomData?.id,
        additional_info: additionalInfo
    };
    logger.log('supabase:database', 'createAttendance:', attendance);

    const { error } = await supabase.from('attendance').insert(attendance);
    if (error) logger.error('supabase:database', 'Error creating attendance', error.message)
    return ({ error: error?.message });
};

/**
 * Check if the maximum number of people in the room is reached
 */

export const isAttendancesLimitReached = async (roomCode: string): Promise<{ isReached: boolean | null, error: string | null}> => {

    const { data: roomData } = await fetchOpenRoomByCode(roomCode);
	if (!roomData) {
		logger.error('next:page', 'Room not found');
		return ({ isReached: null, error: 'Room not found' });
	}
    const attendanceCount = await countAttendances(roomData.id);
    const maxParticipants = 10;

    if (attendanceCount >= maxParticipants) {
        // check if the customer is a paid customer
        const isPaidCustomer = await roomCreatorIsPaidCustomer(roomData.id);
        if (!isPaidCustomer) {
            // check if the attendance count is less than 10
            if (attendanceCount >= maxParticipants) {
                logger.log('next:page', 'StudentViewPage', 'attendance count is greater than 10. Blocking user.');
                /*const { data: creatorData, error: creatorError } = await fetchRoomCreator(roomData!.code!);
                const creatorId = creatorData?.created_by;
                if (creatorId) {
                    const { data } = await fetchProfile(creatorId);
                    let creatorName = (data?.first_name || '')  + ' ' + (data?.last_name || '');
                    if (creatorName === ' ') creatorName = 'un utilisateur anonyme';
                    await sendDiscordMessage(`🚪 **Limite de Pratico Free** atteinte (${maxParticipants} participants) pour ${creatorName} dans la salle ${roomCode} !`);
                }*/
                await sendDiscordMessage(`🚪 **Limite de Pratico Free** atteinte (${maxParticipants} participants) dans la room ${roomCode} ${roomData.id}`)
                return ({ isReached: true, error: null });
            }
        }
    }
	// if the customer is a paid customer, we don't need to check the attendance count
	return ({ isReached: false, error: null });
};