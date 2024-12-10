import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { Container, ScrollArea, Section, Table } from "@radix-ui/themes";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import createClient from "@/supabase/clients/server";
import { AttendanceInfoType } from "../page";
import { TableCell } from "../../_components/TableCell";
import { janifera } from "@/app/(frontend)/Fonts";
import { BackButton } from "@/app/(frontend)/[locale]/_components/BackButton";

export default async function AttendanceDetailsPage ({ params }: { params: Params }) {
	const supabase = createClient();
	const roomId = params.room_id;
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
							connexion: formatDate(attendance.created_at, undefined, "time")
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
					<BackButton backTo={`/reports/${roomId}`}/>
					<Table.Root variant="surface">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Heure de connexion</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Signature</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{
							attendances?.map((attendance, index) => {
								return (
									<Table.Row key={index}>
										<Table.Cell>
											{attendance.first_name}
										</Table.Cell>
										<Table.Cell>
											{attendance.last_name}
										</Table.Cell>
										<Table.Cell>
											{attendance.connexion}
										</Table.Cell>
										<Table.Cell className={janifera.className}>
											{`${attendance.first_name} ${attendance.last_name}`}
										</Table.Cell>
									</Table.Row>
								);
							})
						}
						</Table.Body>
					</Table.Root>
				</Container>
			</Section>	
		</ScrollArea>
	</>);
};