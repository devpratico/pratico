import logger from '@/app/_utils/logger';
import { fetchRoomsByCapsuleId } from '@/app/api/actions/room';
import { fetchAttendanceByRoomId } from '@/app/api/actions/attendance';
import { Button, Container, Flex, Heading, Link, ScrollArea, Section, Table } from '@radix-ui/themes';
import { formatDate, sanitizeUuid } from '@/app/_utils/utils_functions';
import { fetchCapsule } from '@/app/api/actions/capsule';
import { ArrowLeft } from 'lucide-react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { redirect } from '@/app/_intl/intlNavigation';
import { TableCell } from '../_components/TableCell';

// TYPE
export type SessionInfoType = {
  id: string;
  created_at: string;
  numberOfParticipant: number;
  status?: 'open' | 'closed';
};

export default async function CapsuleSessionReportPage({ params }: {params: Params}) {
	const capsuleId = params?.capsule_id;
	let capsuleTitle = "";
	if (!capsuleId)
	{
		logger.error("next:page", "CapsuleSessionReportPage", "CapsuleId missing in params");
		return ;
	}

	logger.log("next:page", "CapsuleSessionReportPage", capsuleId);
	let sessions: SessionInfoType[] = [];
	try {
		const { data: roomData, error: roomError } = await fetchRoomsByCapsuleId(capsuleId);
		logger.debug('supabase:database', 'CapsuleSessionsReportServer', 'fetchRoomsByCapsuleId datas', roomData, roomError);
		if (!roomData || roomError) {
			logger.error('supabase:database', 'CapsuleSessionsReportServer', roomError ? roomError : 'No rooms data for this capsule');
			return ;
		}
		const { data: capsuleData, error: capsuleError } = await fetchCapsule(capsuleId);
		if (capsuleData)
			capsuleTitle = capsuleData.title;
		await Promise.all(
			roomData.map(async (room) => {

				const { data, error } = await fetchAttendanceByRoomId(room.id);

				if (!data || error) {
				logger.error('supabase:database', 'CapsuleSessionsReportServer', error ? error : 'No attendance data for this room');
				}
				const infos: SessionInfoType = {
					id: room.id.toString(),
					created_at: room.created_at,
					numberOfParticipant: data ? data.length : 0,
					status: room.status,
				};
				sessions.push(infos);
			})
		);
	} catch (err) {
		console.error('Error getting sessions', err);
	}

  return (
	<>

		<ScrollArea>

	      	<Section px={{ initial: '3', xs: '0' }}>

				<Container >
					<Flex >
						<Button asChild variant='soft'>
							<Link href={`/reports`}><ArrowLeft />Retour
							</Link>	
						</Button>
						<Heading ml="3" mb="4" as="h1">{capsuleTitle && capsuleTitle !== "Sans titre" ? capsuleTitle : "Capsule sans titre"}</Heading>
					</Flex>
					<Table.Root variant="surface">
					
						<Table.Header>
							<Table.Row>
							<Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Nombre de participants</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{
								sessions?.map((session, index) => {
									return (
										<TableCell
											index={index}
											navigationsIds={{capsuleId, roomId: session.id}}
											infos={{
												roomOpen: session.status === "open",
												rowHeaderCell: formatDate(session.created_at),
												cellOne: session.numberOfParticipant > 0 ? session.numberOfParticipant.toString() : "Aucun",
												cellTwo: session.status === "open" ? "En cours" : "Terminé"
											}} />
									);
								})
							}
						</Table.Body>
					</Table.Root>
				</Container>
			</Section>
		</ScrollArea>
	</>
		
  );
}