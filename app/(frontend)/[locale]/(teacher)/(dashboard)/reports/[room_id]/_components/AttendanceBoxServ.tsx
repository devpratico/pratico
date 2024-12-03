import createClient from "@/supabase/clients/server";
import { AttendanceBox, AttendanceBoxProps } from "./AttendanceBox";
import { countAttendances } from "@/app/(backend)/api/attendance/attendance.server";
import logger from "@/app/_utils/logger";
import { Json } from "@/supabase/types/database.types";

type AttendanceBoxServProps = {
	sessionDate: {
		date: string, 
		end: string | null | undefined
	},
	roomId: number,
	userId: string | null
};

export async function AttendanceBoxServ({ sessionDate, roomId, userId }: AttendanceBoxServProps) {
	const supabase = createClient();
	const attendanceCount = await countAttendances(roomId);
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
	const data: AttendanceBoxProps["data"] = {
		attendanceCount: attendanceCount,
		sessionDate: {
		  date: sessionDate.date,
		  end: sessionDate.end,
		},
		userInfo: userInfo,
		nextUrl: `/reports/${roomId}/attendance`,
	  };
	
	return (
		<AttendanceBox data={data}/>
	);
};