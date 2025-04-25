'use server';
import createClient from "@/supabase/clients/server";
import logger from "@/app/_utils/logger";
import { fetchOpenRoomByCode, roomCreatorIsPaidCustomer } from "../room/room.server";
import { countAttendances } from "./attendance.server";
import { sendDiscordMessage } from "../discord/discord.server";
import { TablesInsert, TablesUpdate } from "@/supabase/types/database.types";
import { fetchUser } from "../user/user.server";
import { User } from "@supabase/supabase-js";
import { signInAnonymously } from "../user/user.server";
import { redirect } from "@/app/(frontend)/_intl/intlNavigation";
import { send } from "process";

// TODO: rename this kind of files "actions"


async function insertAttendance(args: {
    first_name: string,
    last_name: string,
    room_code: string,
    user_id: string,
    additional_info?: string
}):
    Promise<{ error: string | null }>
{

    const supabase = createClient();

    // Fetch the room id
    const { data: roomData, error: getIdError } = await supabase
        .from('rooms')
        .select('id')
        .eq('code', args.room_code)
        .eq('status', 'open')
        .single();

    if (getIdError) {
        logger.error(
            'next:api',
            'attendance.client.ts',
            'insertAttendance',
            'fetchOpenRoomByCode returned an error. Cannot get room id. Cannot insert an attendance.',
            getIdError
        );
        return { error: getIdError.message };
    }

    const room_id = roomData?.id;

    if (!room_id) {
        logger.error(
            'next:api',
            'attendance.client.ts',
            'insertAttendance',
            'fetchOpenRoomByCode returned no room id. Cannot insert an attendance.'
        );
        return { error: 'No room id found' };
    }

    const attendanceInsert: TablesInsert<'attendance'> = {
        first_name: args.first_name,
        last_name: args.last_name,
        room_id: room_id,
        user_id: args.user_id,
        additional_info: args.additional_info
    };

    // Check the existence of an already existing attendance for this user id and room id
    const { data: attendanceData, error: getAttendanceError } = await supabase
        .from('attendance')
        .select('id')
        .eq('room_id', room_id)
        .eq('user_id', args.user_id)
        .maybeSingle();

    if (getAttendanceError) {
        logger.error(
            'next:api',
            'attendance.client.ts',
            'insertAttendance',
            'fetching attendance data returned an error. Cannot insert an attendance.',
            getAttendanceError
        );
        return { error: getAttendanceError.message };
    }

    // If the attendance already exists, update it
    if (attendanceData) {
        const attendanceUpdate: TablesUpdate<'attendance'> = {
            first_name: args.first_name,
            last_name: args.last_name,
            additional_info: args.additional_info
        };

        const { error } = await supabase
            .from('attendance')
            .update(attendanceUpdate)
            .eq('id', attendanceData.id);

        return { error: error?.message || null };
    }

    // If the attendance does not exist already, insert it
    const { error } =  await supabase
        .from('attendance')
        .insert(attendanceInsert);

    sendDiscordMessage(`✍️ **Émargement signé** par ${args.first_name} ${args.last_name} dans la room ${args.room_code} !`);

    return { error: error?.message || null };
}





/**
 * Check if the maximum number of people in the room is reached
 */
const isAttendancesLimitReached = async (roomCode: string): Promise<{ isReached: boolean | null, error: string | null }> => {

    const { data: roomData } = await fetchOpenRoomByCode(roomCode);
    if (!roomData) {
        logger.error('next:page', 'Room not found');
        return ({ isReached: null, error: 'Room not found' });
    }

    // check if the customer is a paid customer
    const isPaidCustomer = await roomCreatorIsPaidCustomer(roomData.id);
    if (!isPaidCustomer) {
        // check if the attendance count is less than 10
        const maxParticipants = 10;
        const attendanceCount = await countAttendances(roomData.id);
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
    // if the customer is a paid customer, we don't need to check the attendance count
    return ({ isReached: false, error: null });
};


export async function submitAttendanceForm(prevState: any, formData: FormData): Promise<{ error: string | null }> {
    const roomCode = formData.get('room-code') as string // Hidden input
    const nextUrl = formData.get('next-url') as string // Hidden input
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;
    const additionalInfo = formData.get('additional-info') as string;

    // Check if the maximum number of people in the room is reached
    const { isReached, error } = await isAttendancesLimitReached(roomCode);
    if (error) return { error: error };
    if (isReached) {
        logger.log('next:api', 'attendance.client.ts', 'submitAttendanceForm', 'Return error because limit of participants reached');
        return { error: 'Limite de participants atteinte' };
    }

    // Check if user logged in, otherwise sign in anonymously
    let user: User

    const { user: fetchedUser, error: userError } = await fetchUser()


    if (fetchedUser) {
        user = fetchedUser
    } else {
        logger.log('next:api', 'attendance.client.ts', 'submitAttendanceForm', 'User not found. Signing in anonymously');
        
        const { data, error: anonymousError } = await signInAnonymously()
        if (anonymousError) {
            logger.error('next:api', 'attendance.client.ts', 'submitAttendanceForm', 'Error signing in anonymously', anonymousError);
            return {error: anonymousError};
        }
        if (!data?.user) {
            logger.error('next:api', 'attendance.client.ts', 'submitAttendanceForm', 'User not found after sign in anonymously (no error)');
            return { error: 'User not found after sign in anonymously' };
        }
        user = data.user
    }

    // Create attendance
    const { error: attendanceError } = await insertAttendance({
        first_name: firstName,
        last_name: lastName,
        room_code: roomCode,
        user_id: user.id,
        additional_info: additionalInfo
    });
    if (attendanceError) {
        logger.error('next:api', 'attendance.client.ts', 'submitAttendanceForm', 'Error inserting attendance', attendanceError);
        return { error: attendanceError };
    }

    // Redirect to nextUrl
    redirect(nextUrl);

    return { error: null };
}