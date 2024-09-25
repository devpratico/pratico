import { Link } from "@/app/_intl/intlNavigation";
import logger from "@/app/_utils/logger";
import { formatDate, sanitizeUuid } from "@/app/_utils/utils_functions";
import { fetchAttendance, fetchAttendanceByRoomId } from "@/app/api/actions/attendance";
import { fetchCapsule } from "@/app/api/actions/capsule";
import { fetchRoomDate } from "@/app/api/actions/room";
import { Button, Container, Flex, Heading, ScrollArea, Section, Separator, Table } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { TableCell } from "../../_components/TableCell";

// TYPE
export type AttendanceInfoType = {
	first_name: string | null,
	last_name: string | null,
	connexion: string | undefined,
}

export default async function SessionDetailsPage ({ params }: { params: Params }) {
	const roomId = params.room_id;
	const capsuleId = params.capsule_id;
	let attendances: AttendanceInfoType[] = [];		
	let capsuleTitle = "";
	let sessionDate: string | undefined = "";

	logger.debug("next:page", "SessionDetailsPage", roomId, capsuleId);
	if (!(roomId && capsuleId))
	{
		logger.error("next:page", "SessionDetailsPage", "roomId or capsuleId missing");
		return ;				
	}
	try {
		const {data: roomData, error: roomError} = await fetchRoomDate(roomId);
		logger.debug("supabase:database", "SessionDetailsPage", "fetchRoom", roomData, roomError);
		if (roomData)
			sessionDate = formatDate(roomData.created_at);	
		const { data: attendanceData, error: attendanceError } = await fetchAttendanceByRoomId(roomId);
		logger.debug("supabase:database", "SessionDetailsPage", "fetchAttendanceByRoomID", attendanceData, attendanceError);
		if (!attendanceData?.length)
			logger.log('supabase:database', 'sessionDetailsPage', 'No attendances data for this capsule');
		else if (!attendanceData || attendanceError) {
			logger.error('supabase:database', 'sessionDetailsPage', attendanceError ? attendanceError : 'No attendances data for this capsule');
		}
		const { data: capsuleData, error: capsuleError } = await fetchCapsule(capsuleId);
		if (capsuleData)
			capsuleTitle = capsuleData.title;
		if (attendanceData?.length)
		{
			await Promise.all(
				attendanceData.map(async (attendance) => {
					const { data, error } = await fetchAttendance(attendance.id);
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
	}
	return (<>
		<ScrollArea>
			<Section>
				
				<Container >
					<Flex>
						<Button asChild variant="soft">
							<Link href={`/reports/${sanitizeUuid(capsuleId)}`}>
								<ArrowLeft />Retour
							</Link>
						</Button>
						<Heading ml="3" mb="4" as="h1">{`Emargements${sessionDate ? ` du ${sessionDate}` : ""}`}</Heading>
					</Flex>
					<Heading mb="4" as="h3">{`${capsuleTitle !== "Sans titre" ? capsuleTitle : ""}`}</Heading>

					<Table.Root variant="surface">
						
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>{"Heure d'arrivée"}</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Prénom</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{
							attendances?.map((attendance, index) => {
								return (
									<TableCell index={index} navigationsIds={{capsuleId, roomId}} infos={{roomClosed: true, rowHeaderCell: attendance.connexion, cellOne: attendance.first_name, cellTwo: attendance.last_name}} />
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