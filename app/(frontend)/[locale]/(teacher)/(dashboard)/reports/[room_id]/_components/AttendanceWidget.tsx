import createClient from "@/supabase/clients/server";
import { AttendanceWidgetView, AttendanceWidgetViewProps } from "./AttendanceWidgetView";
import { countAttendances } from "@/app/(backend)/api/attendance/attendance.server";
import logger from "@/app/_utils/logger";
import { Json } from "@/supabase/types/database.types";
import { redirect } from "@/app/(frontend)/_intl/intlNavigation";

type AttendanceWidgetProps = {
	roomId: number,
	userId: string | null
};

export async function AttendanceWidget({ roomId, userId }: AttendanceWidgetProps) {
	const supabase = createClient();
	const attendanceCount = await countAttendances(roomId);
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
	if (userId)
	{
		const { data: userData, error } = await supabase.from('user_profiles').select('first_name, last_name, organization').eq('id', userId).single();
		if (error)
			logger.error('supabase:database', 'sessionDetailsPage', 'fetch names from user_profiles error', error);
		if (userData)
		{
			userInfo = userData;
		}
	}
	const {data: roomData, error: roomError} = await supabase.from('rooms').select('created_at, capsule_id, end_of_session').eq('id', roomId).single();
	if (roomData && roomData?.end_of_session)
		sessionDate = { date: new Date(roomData.created_at), end: new Date(roomData.end_of_session) };
	if (!sessionDate?.date && !sessionDate?.end)
	{
		logger.error('supabase:database', 'sessionDetailsPage', 'fetch session date error', roomError);
		redirect('/reports'); ;
	}

	data = {
		attendanceCount: attendanceCount,
		sessionDate: {
			startDate: sessionDate?.date!,
			endDate: sessionDate?.end!,
		},
		userInfo: userInfo,
		nextUrl: `/reports/${roomId}/attendance`,
	};
	
	return (
		<AttendanceWidgetView data={data}/>
	);
};