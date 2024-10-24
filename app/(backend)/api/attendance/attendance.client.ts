'use server';
import createClient from "@/supabase/clients/server";
import logger from "@/app/_utils/logger";
import { TablesInsert } from "@/supabase/types/database.types";
import { fetchUser } from "../user/user.server";
import { fetchOpenRoomByCode } from "../room/room.server";


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