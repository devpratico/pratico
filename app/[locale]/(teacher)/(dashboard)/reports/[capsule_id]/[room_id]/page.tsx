import { Link } from "@/app/_intl/intlNavigation";
import logger from "@/app/_utils/logger";
import { formatDate, sanitizeUuid } from "@/app/_utils/utils_functions";
import { Button, Container, Flex, Heading, ScrollArea, Section, Table } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { TableCell } from "../../_components/TableCell";
import { Loading } from "../../_components/LoadingPage";
import createClient from "@/supabase/clients/server";

// TYPE
export type AttendanceInfoType = {
	first_name: string | null,
	last_name: string | null,
	connexion: string | undefined,
}

export default async function SessionDetailsPage ({ params }: { params: Params }) {
	const supabase = createClient();
	const roomId = params.room_id;
	const capsuleId = params.capsule_id;
	const sanitizedCapsuleId = sanitizeUuid(capsuleId);
	let attendances: AttendanceInfoType[] = [];		
	let capsuleTitle = "";
	let sessionDate: string | undefined = "";
	let loading = true;

	if (!(roomId && capsuleId && sanitizedCapsuleId))
	{
		logger.error("next:page", "SessionDetailsPage", "roomId or capsuleId missing");
		return ;				
	}
	try {
		const {data: roomData, error: roomError} = await supabase.from('rooms').select('created_at').eq('id', roomId).single();
		if (roomData)
			sessionDate = formatDate(roomData.created_at);	
		const { data: attendanceData, error: attendanceError } = await supabase.from('attendance').select('*').eq('room_id', roomId);
		if (!attendanceData?.length)
			logger.log('supabase:database', 'sessionDetailsPage', 'No attendances data for this capsule');
		else if (!attendanceData || attendanceError) {
			logger.error('supabase:database', 'sessionDetailsPage', attendanceError ? attendanceError : 'No attendances data for this capsule');
		}
		const { data: capsuleData, error: capsuleError } = await supabase.from('capsules').select('*').eq('id', sanitizedCapsuleId).single();
		if (capsuleData)
			capsuleTitle = capsuleData.title;
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
		console.error('Error getting attendances', err);
	} finally {
		loading = false;
	}
	return (<>
		<ScrollArea>
			<Section>
				<Container >
				{
					loading
					? <Loading />
					: <>
						<Flex>
							<Button asChild variant="soft">
								<Link href={`/reports`}>
									<ArrowLeft />Retour
								</Link>
							</Button>
							<Heading ml="3" mb="4" as="h1">{`Emargements${sessionDate ? ` du ${sessionDate}` : ""}`}</Heading>
						</Flex>
						<Heading mb="4" as="h3">{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</Heading>

						<Table.Root variant="surface">
							
							<Table.Header>
								<Table.Row>
									<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
									<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
									<Table.ColumnHeaderCell>{"Heure d'arrivée"}</Table.ColumnHeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
							{
								attendances?.map((attendance, index) => {
									return (
										<TableCell key={index} index={index} navigationsIds={{capsuleId, roomId}} infos={{roomClosed: true, rowHeaderCell: attendance.last_name, cellOne: attendance.first_name, cellTwo: attendance.connexion}} />
									);
								})
							}
							</Table.Body>
						</Table.Root>
					</>
				}
				</Container>
			</Section>
		</ScrollArea>
	</>);
};