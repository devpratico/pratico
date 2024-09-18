'use server';

import createClient from "@/supabase/clients/server";
import logger from "@/app/_utils/logger";
import { TablesInsert } from "@/supabase/types/database.types";
import { fetchUser } from "./user";
import { fetchOpenRoomByCode } from "./room";

export type AttendanceInsert = TablesInsert<'attendance'>

export const createAttendance = async (firstName: string, lastName: string, roomCode: string | undefined ) => {
	const { user, error: userError } = await fetchUser();
	if (!user || !roomCode)
    {
		logger.log('next:page', 'User or room info is missing');
		return ({ data: null, error: userError });
	}
	logger.log('next:page', 'createAttendance', roomCode);
	const { data: roomData }= await fetchOpenRoomByCode(roomCode);
	const attendance: AttendanceInsert = {
		user_id: user.id,
		first_name: firstName,
		last_name: lastName,
		signature: true,
		room_id: roomData?.id,
	};
	const supabase = createClient();
    const { data, error } = await supabase.from('attendance').upsert(attendance).select()
    if (error) logger.error('supabase:database', 'Error creating attendance', error.message)
    return { data, error: error?.message }
};

export const fetchAttendance = async (userId: string) => {
	const supabase = createClient()
    const { data, error } = await supabase.from('attendance').select('*').eq('user_id', userId).limit(1).single()
    if (error) logger.error('supabase:database', `error fetching attendance for user ${userId.slice(0, 5)}...`, error.message)
    return { data, error: error?.message }
};

export const fetchNamesFromAttendance = async (userId: string) => {
	const supabase = createClient()
	const { data, error } = await supabase.from('attendance').select('first_name, last_name').eq('id', userId).single();
    if (error) {
        logger.log('supabase:database', `no names for user ${userId.slice(0, 5)}...`, error.message);
        return ({ first_name: null, last_name: null });
    } else {
        logger.log('supabase:database', `fetched names for user ${userId.slice(0, 5)}...`, data?.first_name, data?.last_name);
        return (data);
    }
};