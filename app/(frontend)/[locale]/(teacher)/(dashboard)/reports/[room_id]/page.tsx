import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { Container, ScrollArea, Section } from "@radix-ui/themes";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import createClient from "@/supabase/clients/server";
import AttendanceToPDF, { TeacherInfo } from "../_components/AttendanceToPDF";

// TYPE
export type AttendanceInfoType = {
	first_name: string | null,
	last_name: string | null,
	connexion: string | undefined,
}
// // TYPE
export type SessionInfoType = {
  id: string;
  created_at: string;
  numberOfParticipant: number;
  status?: 'open' | 'closed';
  capsule_id?: string;
  capsule_title?: string | null
};

export default async function SessionDetailsPage ({ params }: { params: Params }) {
	const supabase = createClient();
	const roomId = params.room_id;
	let attendances: AttendanceInfoType[] = [];		
	let capsuleTitle = "Sans titre";
	let sessionDate: string | undefined = "";
	let userInfo: TeacherInfo | null = null;

	if (!(roomId))
	{
		logger.error("next:page", "SessionDetailsPage", "roomId or capsuleId missing");
		return ;				
	}
	try {
		const {data: { user }} = await supabase.auth.getUser();
		const { data, error } = await supabase.from('user_profiles').select('first_name, last_name').eq('id', user?.id).single();
		if (error)
			logger.error('supabase:database', 'sessionDetailsPage', 'fetch names from user_profiles error', error);
		if (data)
			userInfo = data;
		const {data: roomData, error: roomError} = await supabase.from('rooms').select('created_at, capsule_id').eq('id', roomId).single();
		if (roomData)
			sessionDate = roomData.created_at;	
		const { data: attendanceData, error: attendanceError } = await supabase.from('attendance').select('*').eq('room_id', roomId);
		if (!attendanceData?.length)
			logger.log('supabase:database', 'sessionDetailsPage', 'No attendances data for this capsule');
		else if (!attendanceData || attendanceError) {
			logger.error('supabase:database', 'sessionDetailsPage', attendanceError ? attendanceError : 'No attendances data for this capsule');
		}
		const capsuleId = roomData?.capsule_id;
		if (capsuleId)
		{
			const { data: capsuleData, error: capsuleError } = await supabase.from('capsules').select('*').eq('id', capsuleId).single();
			if (capsuleData)
				capsuleTitle = capsuleData.title ? capsuleData.title : "Sans titre";
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
						connexion: formatDate(attendance.created_at, undefined, "hour")
					};
					attendances.push(infos);
				})
			);
		}
	} catch (err) {
        logger.error('supabase:database', 'CapsuleSessionsReportServer', 'Error getting attendances', err);
	}
	return (<>
		<ScrollArea>
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
					<AttendanceToPDF attendances={attendances} sessionDate={sessionDate} capsuleTitle={capsuleTitle} user={userInfo}/>
				</Container>
			</Section>	
		</ScrollArea>
	</>);
};