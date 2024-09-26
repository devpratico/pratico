import logger from '@/app/_utils/logger';
import { Button, Container, Flex, Heading, Link, ScrollArea, Section, Table } from '@radix-ui/themes';
import { formatDate, sanitizeUuid } from '@/app/_utils/utils_functions';
import { ArrowLeft } from 'lucide-react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { TableCell } from '../_components/TableCell';
import { Loading } from '../_components/LoadingPage';
import createClient from '@/supabase/clients/server';

// TYPE
export type SessionInfoType = {
  id: string;
  created_at: string;
  numberOfParticipant: number;
  status?: 'open' | 'closed';
  capsule_id?: string;
  capsule_title?: string | null
};

export default async function CapsuleSessionReportPage({ params }: {params: Params}) {
	const supabase = createClient();
	const capsuleId = params?.capsule_id;
	const sanitizedCapsuleId = sanitizeUuid(capsuleId);
	let loading =  true;
	let capsuleTitle = "";
	if (!capsuleId || !sanitizedCapsuleId)
	{
		logger.error("next:page", "CapsuleSessionReportPage", "CapsuleId missing in params");
		return ;
	}
	let sessions: SessionInfoType[] = [];
	try {
		loading = true;
		const { data: roomData, error: roomError } = await supabase.from('rooms').select('*').eq('capsule_id', sanitizedCapsuleId);
		if (!roomData || roomError) {
			logger.error('supabase:database', 'CapsuleSessionsReportPage', roomError ? roomError : 'No rooms data for this capsule');
			return ;
		}
		const { data: capsuleData, error: capsuleError } =  await supabase.from('capsules').select('*').eq('id', sanitizedCapsuleId).single();
		if (capsuleData)
			capsuleTitle = capsuleData.title;
		await Promise.all(
			roomData.map(async (room) => {

				const { data, error } = await supabase.from('attendance').select('*').eq('room_id', room.id);

				if (!data || error) {
					logger.error('supabase:database', 'CapsuleSessionsReportPage', error ? error : 'No attendance data for this room');
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
	} finally {
		loading = false;
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
						{
							loading
							? <Loading />
							: <Table.Root variant="surface">
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
													key={index}
													index={index}
													navigationsIds={{capsuleId, roomId: session.id}}
													infos={{
														roomClosed: session.status === "closed",
														rowHeaderCell: formatDate(session.created_at),
														cellOne: session.numberOfParticipant > 0 ? session.numberOfParticipant.toString() : "Aucun",
														cellTwo: session.status === "open" ? "En cours" : "Terminé"
													}} />
											);
										})
									}
								</Table.Body>
							</Table.Root>
						}
						
					</Container>
			</Section>
		</ScrollArea>
	</>
		
  );
}