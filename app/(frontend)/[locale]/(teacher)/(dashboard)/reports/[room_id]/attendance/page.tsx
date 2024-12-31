import logger from "@/app/_utils/logger";
import { Container, ScrollArea, Section } from "@radix-ui/themes";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import createClient from "@/supabase/clients/server";
import { AttendanceInfoType } from "../page";
import { AttendanceDisplay } from "./_components/AttendanceDisplay";
import { getFormatter } from "next-intl/server";

export default async function AttendanceDetailsPage ({ params }: { params: Params }) {
	const supabase = createClient();
	const roomId = params.room_id;
	const formatter = await getFormatter();
	let attendances: AttendanceInfoType[] = [];
	let capsuleTitle = "Sans titre";
	let sessionDate: { date: string, end: string | null | undefined } = {
		date: "",
		end: ""
	};
	let userInfo: any = null;
	if (!(roomId))
	{
		logger.error("next:page", "SessionDetailsPage", "roomId or capsuleId missing");
		return ;				
	}
	try {
		const {data: { user }} = await supabase.auth.getUser();

		if (user)
		{
			const { data, error } = await supabase.from('user_profiles').select('first_name, last_name, organization').eq('id', user?.id).single();
			if (error)
				logger.error('supabase:database', 'sessionDetailsPage', 'fetch names from user_profiles error', error);
			if (data)
				userInfo = data;
			const {data: roomData, error: roomError} = await supabase.from('rooms').select('created_at, capsule_id, end_of_session').eq('id', roomId).single();
			if (roomData)
				sessionDate = { date: roomData.created_at, end: roomData.end_of_session };	
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
							connexion: attendance.created_at,
						};
						attendances.push(infos);
					})
				);
			}
		}
		
	} catch (err) {
        logger.error('supabase:database', 'CapsuleSessionsReportServer', 'Error getting attendances', err);
	}
	return (<>
		<ScrollArea>
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
					<AttendanceDisplay attendances={attendances} roomId={roomId} sessionDate={sessionDate} userInfo={userInfo} capsuleTitle={capsuleTitle} />
				</Container>
			</Section>	
		</ScrollArea>
	</>);
};