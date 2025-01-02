import createClient from "@/supabase/clients/server";
import { AttendanceWidgetView, AttendanceWidgetViewProps } from "./AttendanceWidgetView";
import { countAttendances } from "@/app/(backend)/api/attendance/attendance.server";
import logger from "@/app/_utils/logger";
import { Json } from "@/supabase/types/database.types";
import { AttendanceInfoType } from "../../page";
import { getUser } from "@/app/(backend)/api/auth/auth.server";

type AttendanceWidgetProps = {
	roomId: string,
	capsuleTitle: string
};

export async function AttendanceWidget({ roomId, capsuleTitle }: AttendanceWidgetProps) {
	const supabase = createClient();
	const attendanceCount = await countAttendances(roomId);
    const userId = (await getUser()).data?.user?.id;
    if (!userId) {
        logger.error('supabase:auth', 'AttendanceWidget', 'No user id');
        throw new Error('No user id');
    }
	let sessionDate: { date: Date, end: Date } | null = null;
	let data: AttendanceWidgetViewProps["data"];
	let userInfo: {
		first_name: string | null;
		last_name: string | null;
		organization: Json | null;
	  } = {
		first_name: null,
		last_name: null,
		organization: null,
	  };
	let attendances: AttendanceInfoType[] = [];
	if (!(roomId))
	{
		logger.error("next:page", "SessionDetailsPage", "roomId or capsuleId missing");
		return ;				
	}
	try {
		const { data: userData, error } = await supabase.from('user_profiles').select('first_name, last_name, organization').eq('id', userId).single();
		if (error)
			logger.error('supabase:database', 'sessionDetailsPage', 'fetch names from user_profiles error', error);
		if (userData)
			userInfo = userData;
		const { data: roomData, error: roomError} = await supabase.from('rooms').select('created_at, capsule_id, end_of_session').eq('id', roomId).single();
		if (roomData && roomData?.end_of_session)
			sessionDate = { date: new Date(roomData.created_at), end: new Date(roomData.end_of_session) };
		if ((!sessionDate?.date && !sessionDate?.end) || roomError)
			logger.error('supabase:database', 'sessionDetailsPage', 'session date ', sessionDate, roomError);
		const { data: attendanceData, error: attendanceError } = await supabase.from('attendance').select('*').eq('room_id', roomId);
		if (!attendanceData?.length)
			logger.log('supabase:database', 'sessionDetailsPage', 'No attendances data for this capsule');
		else if (!attendanceData || attendanceError) {
			logger.error('supabase:database', 'sessionDetailsPage', attendanceError ? attendanceError : 'No attendances data for this capsule');
		}

		if (attendanceData?.length)
		{
			await Promise.all(
				attendanceData.map(async (attendance) => {
					const { data, error } = await supabase.from('attendance').select('*').eq('id', attendance.id).maybeSingle();
					if (!data || error) {
						logger.error('supabase:database', 'CapsuleSessionsReportServer', error ? error : 'No attendance data for this attendance');
					}
					const infos: AttendanceInfoType = {
						first_name: attendance.first_name,
						last_name: attendance.last_name,
						connexion: attendance.created_at,
					};
					attendances.push(infos);
				})
			);
		}
	} catch (err) {
		logger.error('supabase:database', 'CapsuleSessionsReportServer', 'Error getting attendances', err);
	}	

	data = {
		attendanceCount: attendanceCount,
		sessionDate: {
			startDate: sessionDate?.date!,
			endDate: sessionDate?.end!,
		},
		userInfo: userInfo,
		nextUrl: `/reports/${roomId}/attendance`,
		roomId: roomId.toString(),
		attendances: attendances,
		capsuleTitle: capsuleTitle
	};
	
	return (
		<AttendanceWidgetView data={data}/>
	);
};