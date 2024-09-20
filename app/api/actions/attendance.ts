'use server';

import createClient from "@/supabase/clients/server";
import logger from "@/app/_utils/logger";
import { TablesInsert } from "@/supabase/types/database.types";
import { fetchUser } from "./user";
import { fetchOpenRoomByCode } from "./room";

export type AttendanceInsert = TablesInsert<'attendance'>

export const createAttendance = async (firstName: string, lastName: string, roomCode: string | undefined ) => {
	const { user, error: userError } = await fetchUser();
	if (!user || !roomCode || userError)
    {
		if (!userError)
		{
			logger.log('next:page', !user ? 'User not found' : 'or room info is missing');
			return ({error: 'createAttendance: User not found or roonmCode missing'})
		}
		
		return ({ error: userError });
	}
	const { data: roomData }= await fetchOpenRoomByCode(roomCode);

	const attendance: AttendanceInsert = {
		user_id: user.id,
		first_name: firstName,
		last_name: lastName,
		signature: true,
		room_id: roomData?.id,
	};
	logger.log('supabase:database', 'createAttendance:',  attendance);

	const supabase = createClient();
    const { error } = await supabase.from('attendance').insert(attendance);
    if (error) logger.error('supabase:database', 'Error creating attendance', error.message)
    return ({ error: error?.message });
};

export const fetchAllAttendances = async () => {
	const supabase = createClient();
    const { data, error } = await supabase.from('attendance').select();
    if (error) logger.error('supabase:database', `error fetching all attendances.`, error.message)
    return ({ data, error: error?.message });
};

export const fetchAttendance = async (id: number | undefined) => {
	if (!id)
	{
		logger.error('next:api', 'fetchAttendance id missing');
		return ({data: null, error: 'fetchAttendance id missing'});
	}
	const supabase = createClient();
    const { data, error } = await supabase.from('attendance').select('*').eq('id', id).maybeSingle();
    if (error) logger.error('supabase:database', `error fetching attendance ${id}...`, error.message)
    return ({ data, error: error?.message });
};

export const fetchAttendanceByRoomId = async (roomId: number | undefined) => {
	if (!roomId)
	{
		logger.error('next:api', 'fetchAttendanceByRoomId id missing');
		return ({data: null, error: 'fetchAttendanceByrRoomId id missing'});
	}
	const supabase = createClient();
    const { data, error } = await supabase.from('attendance').select('*').eq('room_id', roomId);
    if (error) logger.error('supabase:database', `error fetching attendance with room ID ${roomId}...`, error.message);
    return ({ data, error: error?.message });
};


export const fetchAttendanceByUser = async (userId: string) => {
	if (!userId)
	{
		logger.error('next:api', 'fetchAttendanceByUser id missing');
		return ({data: null, error: 'fetchAttendanceByUser id missing'});
	}
	const supabase = createClient();
    const { data, error } = await supabase.from('attendance').select('*').eq('user_id', userId);
    if (error) logger.error('supabase:database', `error fetching attendance with user ${userId.slice(0, 5)}...`, error.message)
    return ({ data, error: error?.message });
};

export const fetchNamesFromAttendance = async (userId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase.from('attendance').select().eq('user_id', userId).maybeSingle();
    if (error || null) {
        logger.log('supabase:database', `no names for user ${userId.slice(0, 5)}...`, error?.message);
        return ({ data: null, error: error ? error : 'No data found, null returned'});
    } else {
        logger.log('supabase:database', `fetched names for user ${userId.slice(0, 5)}...`, data?.first_name, data?.last_name);
        return ({data, error: null});
    }
<<<<<<< HEAD:app/api/actions/attendance.ts
};

export const fetchUserHasSignedAttendance = async (roomId: number | undefined, userId: string) => {
	logger.log('next:api', 'fetUserHasSignedAttendance', `roomId: ${roomId}, userId: ${userId}`);
	if (!roomId || !userId)
	{
		logger.error('next:api', 'fetchUserHasSignedAttendance roomnId or userId missing');
		return ({data: null, error: 'fetchUserHasSignedAttendance roomId or userId missing'});
	}
	const supabase = createClient();
    const { data, error } = await supabase.from('attendance').select('*').eq('room_id', roomId);
    if (error) logger.error('supabase:database', `error fetching attendance with room id ${roomId}...`, error.message);
	if (!data)
		return ({data: null, error: error ? error?.message : 'No attendance found with this id'});
	logger.log('next:api', 'fetUserHasSignedAttendance room datas', data);
	const participant = data.find((elem) => {
		if (elem.user_id === userId)
			return ({first_name: elem.first_name, last_name: elem.last_name});
	});
	return ({data: participant ? {first_name: participant?.first_name, last_name: participant?.last_name} : null, error: error ? error : null});
=======
	return ;
>>>>>>> ba7af0e (UPDATE Reports page with capsule image and few info):app/api/_actions/attendance.ts
};